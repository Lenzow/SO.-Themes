// get_token.js
// 
// ⚠️  NOTE: This script is now LEGACY/OPTIONAL
// 
// The worker now uses Client Credentials Grant automatically with caching.
// You no longer need to manually fetch tokens - just set CLIENT_ID and CLIENT_SECRET.
//
// This script can still be used for testing or manual token verification.
//
// Usage: node get_token.js <SHOP_DOMAIN> <CLIENT_ID> <CLIENT_SECRET>
//
// References:
// - Client Credentials Grant: https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant
// - Dev Dashboard: https://shopify.dev/docs/apps/build/dev-dashboard

const shop = process.argv[2];
const clientId = process.argv[3];
const clientSecret = process.argv[4];

if (!shop || !clientId || !clientSecret) {
    console.error("Usage: node get_token.js <SHOP_DOMAIN> <CLIENT_ID> <CLIENT_SECRET>");
    console.error("Example: node get_token.js so-bysora-devstore.myshopify.com 8a0723c5e50f444bdd84394836934b6b shpss_...");
    console.error("\n⚠️  This is a test utility. The worker handles tokens automatically.");
    console.error("   You only need to set CLIENT_ID and CLIENT_SECRET in wrangler secrets.");
    process.exit(1);
}

// Ensure clean domain
const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');

async function getToken() {
    console.log(`\n🔐 Testing Client Credentials Grant for ${cleanShop}...\n`);

    const url = `https://${cleanShop}/admin/oauth/access_token`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Request failed:", response.status, errorText);
            process.exit(1);
        }

        const data = await response.json();

        if (data.access_token) {
            console.log("✅ SUCCESS! Token obtained via Client Credentials Grant");
            console.log("\n============================================");
            console.log("ACCESS TOKEN (expires ~24 hours):");
            console.log("============================================");
            console.log(data.access_token);
            console.log("============================================");
            console.log("\n📝 NOTE: The worker automatically handles token refresh.");
            console.log("   You do NOT need to set this token manually.");
            console.log("\n✅ Instead, set these secrets in your worker:");
            console.log("   npx wrangler secret put SHOPIFY_CLIENT_ID");
            console.log("   npx wrangler secret put SHOPIFY_CLIENT_SECRET");
            console.log("   npx wrangler secret put SHOPIFY_SHOP_DOMAIN");
            console.log("\n🎯 Get Client ID & Secret from:");
            console.log("   Shopify Dev Dashboard > Your Custom App > Settings");
        } else {
            console.error("❌ Error: No access_token in response:", data);
            process.exit(1);
        }
    } catch (error) {
        console.error("❌ Network Error:", error.message);
        process.exit(1);
    }
}

getToken();
