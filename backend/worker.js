// In-memory token cache (for single-instance deployments)
// For production with multiple worker instances, use Cloudflare KV instead
let tokenCache = {
  token: null,
  expiresAt: 0
};

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


    // 0. Configuration Check (Client Credentials Grant - 2024/2025 Update)
    if (!env.SHOPIFY_CLIENT_ID || !env.SHOPIFY_CLIENT_SECRET || !env.SHOPIFY_SHOP_DOMAIN) {
      return new Response(JSON.stringify({
        error: "Configuration Error: Secrets not set. Please run:\n" +
               "  'wrangler secret put SHOPIFY_CLIENT_ID'\n" +
               "  'wrangler secret put SHOPIFY_CLIENT_SECRET'\n" +
               "  'wrangler secret put SHOPIFY_SHOP_DOMAIN'\n\n" +
               "Get these from: Shopify Dev Dashboard > Your Custom App > Settings"
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

      // Check if response has data
      if (!fileRes.data || !fileRes.data.fileCreate) {
        throw new Error("File creation failed: Invalid response from Shopify");
      }

      if (fileRes.data.fileCreate.userErrors && fileRes.data.fileCreate.userErrors.length > 0) {
        const userErrors = fileRes.data.fileCreate.userErrors.map(e => e.message || JSON.stringify(e)).join('; ');
        console.error("File Create Errors:", userErrors);
        // Continue anyway to at least save the data, but log the error
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

    // Images field: Store file IDs as JSON string
    // Field name: submission_images (type: JSON or Single line text in Metaobject)
    if (fileIds.length > 0) {
      fields.push({ key: "submission_images", value: JSON.stringify(fileIds) });
    }

    const metaobjectInput = {
      type: "consignment_submission",
      fields: fields
    };

    const moRes = await shopifyGraphql(metaobjectQuery, { metaobject: metaobjectInput }, env);

    // Check if response has data
    if (!moRes.data || !moRes.data.metaobjectCreate) {
      throw new Error("Metaobject creation failed: Invalid response from Shopify");
    }

    if (moRes.data.metaobjectCreate.userErrors && moRes.data.metaobjectCreate.userErrors.length > 0) {
      const userErrors = moRes.data.metaobjectCreate.userErrors.map(e => e.message || e.field ? `${e.field}: ${e.message}` : JSON.stringify(e)).join('; ');
      return new Response(JSON.stringify({ error: `Metaobject creation errors: ${userErrors}` }), {
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
    console.error("Submit Consign Error:", err);
    // Return the actual error message for better debugging
    const errorMessage = err.message || "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: corsHeaders() });
  }
}

/**
 * Get Access Token using Client Credentials Grant (2024/2025 Shopify Update)
 * Tokens expire after ~24 hours, so we cache and refresh as needed
 * 
 * Reference: https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant
 */
async function getAccessToken(env) {
  const now = Date.now();
  
  // Check if we have a valid cached token (refresh 1 hour before expiry)
  if (tokenCache.token && tokenCache.expiresAt > (now + 3600000)) {
    return tokenCache.token;
  }

  const shop = env.SHOPIFY_SHOP_DOMAIN ? env.SHOPIFY_SHOP_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '').trim() : '';
  const clientId = env.SHOPIFY_CLIENT_ID ? env.SHOPIFY_CLIENT_ID.trim() : '';
  const clientSecret = env.SHOPIFY_CLIENT_SECRET ? env.SHOPIFY_CLIENT_SECRET.trim() : '';

  if (!shop || !clientId || !clientSecret) {
    throw new Error("Missing required credentials for Client Credentials Grant");
  }

  const url = `https://${shop}/admin/oauth/access_token`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error("No access_token in response: " + JSON.stringify(data));
    }

    // Cache the token (Shopify tokens last ~24 hours, we'll cache for 23 hours)
    tokenCache.token = data.access_token;
    tokenCache.expiresAt = now + (23 * 60 * 60 * 1000); // 23 hours in milliseconds

    return data.access_token;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw new Error(`Token fetch failed: ${error.message}`);
  }
}

// Helper: Run GraphQL Query against Shopify
async function shopifyGraphql(query, variables, env) {
  const shop = env.SHOPIFY_SHOP_DOMAIN ? env.SHOPIFY_SHOP_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '').trim() : '';
  
  // Get access token using Client Credentials Grant (handles caching automatically)
  let token;
  try {
    token = await getAccessToken(env);
  } catch (error) {
    // If token fetch fails, throw a clearer error
    throw new Error(`Authentication failed: ${error.message}. Please check your CLIENT_ID, CLIENT_SECRET, and SHOP_DOMAIN secrets.`);
  }

  const url = `https://${shop}/admin/api/2025-10/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token
    },
    body: JSON.stringify({ query, variables })
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    
    // Check for GraphQL errors
    if (json.errors && json.errors.length > 0) {
      const errorMessages = json.errors.map(e => e.message || JSON.stringify(e)).join('; ');
      throw new Error(`Shopify API Error: ${errorMessages}`);
    }
    
    // Check for HTTP errors
    if (!res.ok) {
      throw new Error(`Shopify API returned ${res.status}: ${text.substring(0, 200)}`);
    }
    
    return json;
  } catch (e) {
    // If it's already our custom error, rethrow it
    if (e.message && (e.message.includes('Shopify API') || e.message.includes('Authentication failed'))) {
      throw e;
    }
    // Otherwise, throw connection error
    throw new Error(`Connection Failed. URL: ${url}. Status: ${res.status}. Response: ${text.substring(0, 100)}...`);
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Configure this to your domain in production
    "Content-Type": "application/json"
  };
}
