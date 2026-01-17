# Quick Setup Reference - Consign Backend

## 📋 App Credentials

**App Name**: Consignment backend V2  
**Shop Domain**: so-bysora-devstore.myshopify.com  
**Client ID**: `94c4f649efa55b1780649f85a48bff50`  
**Client Secret**: `[Get from Shopify Dev Dashboard]`

---

## ⚡ Quick Setup Commands

### 1. Set Cloudflare Worker Secrets

```bash
cd backend

# Set Client ID
npx wrangler secret put SHOPIFY_CLIENT_ID
# When prompted, paste: 94c4f649efa55b1780649f85a48bff50

# Set Client Secret
npx wrangler secret put SHOPIFY_CLIENT_SECRET
# When prompted, paste: 

# Set Shop Domain
npx wrangler secret put SHOPIFY_SHOP_DOMAIN
# When prompted, enter: so-bysora-devstore.myshopify.com
```

### 2. Deploy Worker

```bash
npx wrangler deploy
```

### 3. Test Token Fetch (Optional)

```bash
node get_token.js so-bysora-devstore.myshopify.com 94c4f649efa55b1780649f85a48bff50 YOUR_CLIENT_SECRET 
```

---

## 🔗 Important Links

- **Shopify Dev Dashboard**: https://partners.shopify.com/
- **App Settings**: Dev Dashboard > Stores > so-bysora-devstore > Apps > Consign Backend > Settings
- **Shop Admin**: https://so-bysora-devstore.myshopify.com/admin
- **Metaobjects**: Shopify Admin > Content > Metaobjects > Consignment Submission

---

## 📝 Notes

- ✅ Secrets are stored securely in Cloudflare Workers (not in code)
- ✅ Worker automatically handles token refresh (24-hour tokens)
- ✅ No manual token management needed
- ✅ Test utility script (`get_token.js`) available for verification

---

## ✅ Verification Checklist

- [ ] All three secrets set in Cloudflare Worker
- [ ] Worker deployed successfully
- [ ] Test token fetch works (optional)
- [ ] Test consignment submission end-to-end
- [ ] Verify Metaobject creation in Shopify Admin
- [ ] Verify File entries created and linked