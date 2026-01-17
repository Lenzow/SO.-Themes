// get_token.js
// Usage: node get_token.js <SHOP_DOMAIN> <CLIENT_ID> <CLIENT_SECRET>

const shop = process.argv[2];
const clientId = process.argv[3];
const clientSecret = process.argv[4];

if (!shop || !clientId || !clientSecret) {
    console.error("Usage: node get_token.js <SHOP_DOMAIN> <CLIENT_ID> <CLIENT_SECRET>");
    console.error("Example: node get_token.js myshop.myshopify.com 12345 abcde");
    process.exit(1);
}

// Ensure clean domain
const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');

async function getToken() {
    console.log(`Requesting token for ${cleanShop}...`);

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

        const data = await response.json();

        if (data.access_token) {
            console.log("\n============================================");
            console.log("SUCCESS! HERE IS YOUR PERMANENT TOKEN:");
            console.log("============================================");
            console.log(data.access_token);
            console.log("============================================");
            console.log("\nNow run:");
            console.log(`npx wrangler secret put SHOPIFY_ACCESS_TOKEN`);
            console.log("(And paste the token above)");
        } else {
            console.error("Error:", data);
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

getToken();
