# Migration to Shopify Client Credentials Grant (2024/2025 Update)

## Summary

✅ **Successfully migrated from permanent token to Client Credentials Grant workflow**

This migration aligns the codebase with Shopify's 2024/2025 updates requiring apps to be created via the Dev Dashboard and use the Client Credentials Grant for authentication.

---

## 🔄 What Changed

### Before (Legacy)
- Used permanent `SHOPIFY_ACCESS_TOKEN` from Private Apps
- Token set once via `wrangler secret put SHOPIFY_ACCESS_TOKEN`
- No automatic token refresh

### After (2024/2025 Update)
- ✅ Uses `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` from Dev Dashboard
- ✅ Automatically fetches 24-hour access tokens via Client Credentials Grant
- ✅ Implements token caching with automatic refresh (refreshes 1 hour before expiry)
- ✅ Aligned with Shopify's new app creation workflow

---

## 📝 Files Modified

### 1. `backend/worker.js`
**Changes:**
- ✅ Added `getAccessToken()` function implementing Client Credentials Grant
- ✅ Added in-memory token cache with expiration tracking
- ✅ Updated `shopifyGraphql()` to use dynamic token fetching
- ✅ Updated configuration checks to require `CLIENT_ID` and `CLIENT_SECRET`

**Key Functions Added:**
```javascript
// Lines 1-6: Token cache
let tokenCache = { token: null, expiresAt: 0 };

// Lines 247-284: Client Credentials Grant implementation
async function getAccessToken(env) {
  // Fetches token from Shopify OAuth endpoint
  // Caches token for 23 hours
  // Auto-refreshes when needed
}
```

### 2. `backend/wrangler.toml`
**Changes:**
- ✅ Updated secret requirements documentation
- ✅ Removed `SHOPIFY_ACCESS_TOKEN` requirement
- ✅ Added `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` requirements
- ✅ Added setup instructions with Dev Dashboard links

### 3. `backend/get_token.js`
**Changes:**
- ✅ Marked as legacy/optional utility script
- ✅ Updated comments explaining it's for testing only
- ✅ Worker now handles tokens automatically
- ✅ Updated help text with new setup instructions

### 4. `WORKFLOW_VERIFICATION.md`
**Changes:**
- ✅ Updated to reflect implemented handshake mechanism
- ✅ Removed "NOT IMPLEMENTED" warnings
- ✅ Added setup instructions for Dev Dashboard
- ✅ Updated conclusion to show full alignment

---

## 🚀 Setup Instructions

### Step 1: Create Custom App in Shopify Dev Dashboard

1. Log into **Shopify Partners Dashboard**: https://partners.shopify.com/
2. Navigate to your store's **Dev Dashboard**
3. Create a **Custom App** named "Consign Backend" (no app review needed for merchant-owned stores)
4. Go to your app → **Settings**
5. Copy the **Client ID** and **Client Secret**

**Current App Details:**
- **App Name**: Consign Backend
- **Shop Domain**: so-bysora-devstore.myshopify.com
- **Client ID**: 8a0723c5e50f444bdd84394836934b6b
- **Secret**: 

**Documentation:**
- [About Dev Dashboard - Merchants](https://shopify.dev/docs/apps/build/dev-dashboard#merchants)
- [App Distribution](https://shopify.dev/docs/apps/launch/distribution)

### Step 2: Set Cloudflare Worker Secrets

```bash
cd backend

# Set Client ID
npx wrangler secret put SHOPIFY_CLIENT_ID
# Paste: 8a0723c5e50f444bdd84394836934b6b

# Set Client Secret
npx wrangler secret put SHOPIFY_CLIENT_SECRET
# Paste: 

# Set Shop Domain
npx wrangler secret put SHOPIFY_SHOP_DOMAIN
# Enter: so-bysora-devstore.myshopify.com (no https://)
```

### Step 3: Deploy Worker

```bash
npx wrangler deploy
```

### Step 4: Test

1. Test a consignment submission
2. Verify token fetch works (check worker logs)
3. Verify Metaobject creation in Shopify Admin
4. Verify File entries are created

---

## 🔐 How It Works

### Client Credentials Grant Flow

```
1. Worker receives request
   ↓
2. Check cached token (if exists and not expired)
   ↓
3. If expired/missing:
   - POST to https://{shop}/admin/oauth/access_token
   - Send: { client_id, client_secret, grant_type: "client_credentials" }
   - Receive: { access_token } (valid ~24 hours)
   - Cache token with expiration timestamp
   ↓
4. Use cached/fresh token for Shopify GraphQL requests
   ↓
5. Auto-refresh when token expires (refreshes 1 hour before expiry)
```

### Token Caching

- **Storage**: In-memory (per worker instance)
- **Expiration**: 23 hours (refreshes 1 hour before Shopify's 24h expiry)
- **Refresh**: Automatic on next request after expiry
- **Note**: For multi-instance deployments, consider Cloudflare KV for shared cache

---

## 📚 Documentation References

- [Client Credentials Grant](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant)
- [Dev Dashboard - Merchants](https://shopify.dev/docs/apps/build/dev-dashboard#merchants)
- [App Distribution](https://shopify.dev/docs/apps/launch/distribution#capabilities-and-requirements)

---

## ⚠️ Important Notes

1. **Custom Apps Only**: Client Credentials Grant is for Custom Apps in stores you own. Public apps require different auth flows.

2. **Token Lifetime**: Tokens expire after ~24 hours. The worker automatically refreshes them.

3. **Multi-Instance Deployments**: Currently uses in-memory caching. For production with multiple worker instances, consider implementing Cloudflare KV for shared token cache.

4. **Removed Secrets**: If you had `SHOPIFY_ACCESS_TOKEN` set previously, you can remove it:
   ```bash
   npx wrangler secret delete SHOPIFY_ACCESS_TOKEN
   ```

---

## ✅ Verification Checklist

- [ ] Custom App created in Shopify Dev Dashboard
- [ ] Client ID and Client Secret copied from app settings
- [ ] Worker secrets set (`SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`, `SHOPIFY_SHOP_DOMAIN`)
- [ ] Worker deployed successfully
- [ ] Test submission works end-to-end
- [ ] Token fetch works (check worker logs)
- [ ] Metaobject created in Shopify Admin
- [ ] File entries created and linked correctly
- [ ] Old `SHOPIFY_ACCESS_TOKEN` secret removed (if it existed)

---

## 🎯 Status

✅ **Migration Complete**

The codebase is now fully aligned with Shopify's 2024/2025 authentication requirements and the documented workflow. The "2026 handshake" mechanism is fully implemented.