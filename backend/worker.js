export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }


    // 0. Configuration Check
    if (!env.SHOPIFY_ACCESS_TOKEN || !env.SHOPIFY_SHOP_DOMAIN) {
      return new Response(JSON.stringify({
        error: "Configuration Error: Secrets not set. Please run 'wrangler secret put SHOPIFY_ACCESS_TOKEN' and 'wrangler secret put SHOPIFY_SHOP_DOMAIN'."
      }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });
    }

    const url = new URL(request.url);

    // 1. Sign Uploads (Staged Uploads Create)
    if (url.pathname === "/api/sign-upload") {
      return handleSignUpload(request, env);
    }

    // 2. Finalize Submission (File Create + Metaobject Create)
    if (url.pathname === "/api/submit-consign") {
      return handleSubmitConsign(request, env);
    }

    return new Response("Not Found", { status: 404 });
  },
};

/**
 * Endpoint: /api/sign-upload
 * Calls Shopify stagedUploadsCreate to get signed URLs for files.
 */
async function handleSignUpload(request, env) {
  try {
    const { files } = await request.json(); // Array of { filename, mimeType, fileSize }

    if (!files || files.length === 0) {
      return new Response("No files provided", { status: 400, headers: corsHeaders() });
    }

    // Basic Validation
    if (files.length > 5) {
      return new Response("Max 5 files allowed", { status: 400, headers: corsHeaders() });
    }
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimeType)) {
        return new Response(`Invalid file type: ${file.filename}`, { status: 400, headers: corsHeaders() });
      }
      // 20MB limit
      if (file.fileSize > 20 * 1024 * 1024) {
        return new Response(`File too large: ${file.filename}`, { status: 400, headers: corsHeaders() });
      }
    }

    const inputs = files.map(file => ({
      filename: file.filename,
      mimeType: file.mimeType,
      resource: "FILE",
      httpMethod: "POST"
    }));

    const query = `
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            url
            resourceUrl
            parameters {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;


    const response = await shopifyGraphql(query, { input: inputs }, env);

    // Safety Check: Did Shopify return top-level errors?
    if (!response.data || !response.data.stagedUploadsCreate) {
      throw new Error(JSON.stringify(response.errors || response));
    }

    if (response.data.stagedUploadsCreate.userErrors.length > 0) {
      throw new Error(JSON.stringify(response.data.stagedUploadsCreate.userErrors));
    }

    return new Response(JSON.stringify(response.data.stagedUploadsCreate), {
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders() });
  }
}

/**
 * Endpoint: /api/submit-consign
 * 1. Creates File entries in Shopify using the resourceUrls
 * 2. Creates the Metaobject entry
 */
async function handleSubmitConsign(request, env) {
  try {
    const data = await request.json();
    const {
      uploadedResources, // Array of resourceUrls from the frontend upload step
      formData
    } = data;

    // Rate Limiting (Simple In-Memory for now, ideally use KV)
    // For this implementation guide, we skip complex KV logic but recommend it for production

    // 1. Create Files in Shopify
    const fileIds = [];
    if (uploadedResources && uploadedResources.length > 0) {
      const fileCreateQuery = `
            mutation fileCreate($files: [FileCreateInput!]!) {
              fileCreate(files: $files) {
                files {
                  id
                  fileStatus
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `;

      const fileInputs = uploadedResources.map(resUrl => ({
        originalSource: resUrl,
        contentType: "IMAGE"
      }));

      const fileRes = await shopifyGraphql(fileCreateQuery, { files: fileInputs }, env);

      if (fileRes.data.fileCreate.userErrors.length > 0) {
        console.error("File Create Errors:", fileRes.data.fileCreate.userErrors);
        // Continue anyway to at least save the data
      }

      if (fileRes.data.fileCreate.files) {
        fileRes.data.fileCreate.files.forEach(f => fileIds.push(f.id));
      }
    }

    // 2. Create Metaobject
    const metaobjectQuery = `
        mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
          metaobjectCreate(metaobject: $metaobject) {
            metaobject {
              id
              handle
            }
            userErrors {
              field
              message
            }
          }
        }
      `;


    // Helper to get value from various key formats
    const getVal = (key) => formData[key] || formData[`contact[${key}]`] || "";

    // Map Condition Descriptions
    const conditionMap = {
      "New / Never Used": "New / Never Used: Never been worn, with or without tags.",
      "Excellent": "Excellent: Worn a few times, minimal signs of use.",
      "Good": "Good: Light signs of use, overall good condition.",
      "Acceptable": "Acceptable: Visible signs of use, still wearable and presentable."
    };
    const conditionVal = getVal("Condition");
    const brandVal = getVal("Brand");
    const brandCustom = getVal("Brand_Custom");

    const fields = [
      { key: "full_name", value: getVal("name") },
      { key: "email", value: getVal("email") },
      { key: "phone", value: getVal("phone") }, // The frontend puts the formatted phone into 'contact[phone]'
      { key: "category", value: getVal("Collection") },
      { key: "brand", value: brandVal === "Brand Not Listed" ? brandCustom : brandVal },
      { key: "condition", value: conditionVal },
      { key: "condition_description", value: conditionMap[conditionVal] || conditionVal },
      { key: "description", value: getVal("Description") },
      { key: "status", value: "New" },
      { key: "submission_type", value: "Quick Quote" }
    ];

    if (fileIds.length > 0) {
      fields.push({ key: "images", value: JSON.stringify(fileIds) });
    }

    const metaobjectInput = {
      type: "consignment_submission",
      fields: fields
    };

    const moRes = await shopifyGraphql(metaobjectQuery, { metaobject: metaobjectInput }, env);

    if (moRes.data.metaobjectCreate.userErrors.length > 0) {
      return new Response(JSON.stringify({ error: moRes.data.metaobjectCreate.userErrors }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    return new Response(JSON.stringify({
      success: true,
      handle: moRes.data.metaobjectCreate.metaobject.handle,
      fileCount: fileIds.length
    }), {
      headers: corsHeaders()
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: corsHeaders() });
  }
}

// Helper: Run GraphQL Query against Shopify
async function shopifyGraphql(query, variables, env) {
  const shop = env.SHOPIFY_SHOP_DOMAIN ? env.SHOPIFY_SHOP_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '').trim() : '';
  const token = env.SHOPIFY_ACCESS_TOKEN ? env.SHOPIFY_ACCESS_TOKEN.trim() : '';

  const res = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token
    },
    body: JSON.stringify({ query, variables })
  });

  return await res.json();
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Configure this to your domain in production
    "Content-Type": "application/json"
  };
}
