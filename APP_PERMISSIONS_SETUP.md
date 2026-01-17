# Fixing API Access Error - Missing Scopes

> **Note**: If you cannot edit scopes in your existing app, you may need to create a new Custom App. See `REQUIRED_SCOPES.md` for the complete scope list.

## ❌ Error Message
**"Shopify API Error: Access denied for metaobject field. Required access: 'read_metaobjects` access scope."**

This means your Custom App doesn't have the required API scopes/permissions to access Metaobjects.

---

## ✅ Solution: Add Required Scopes to Your App

### Step 1: Go to Shopify Dev Dashboard

1. **Log into Shopify Partners Dashboard**: https://partners.shopify.com/
2. **Navigate to your store**: Click on "so-bysora-devstore"
3. **Go to Apps section**: Click on "Apps" in the left sidebar
4. **Open your app**: Click on **"Consign Backend"** app

### Step 2: Configure API Scopes

1. **Go to Configuration**: Click on **"Configuration"** in the left sidebar of your app
2. **Find "Admin API integration scopes"** section
3. **Click "Configure"** next to "Admin API integration scopes"

### Step 3: Add Required Scopes

Scroll down and find these scopes, then **check/enable** them:

#### Required Scopes (Must Have):
- ✅ `read_files` - Read files
- ✅ `write_files` - Write files  
- ✅ `read_metaobjects` - Read metaobjects ⚠️ **REQUIRED**
- ✅ `write_metaobjects` - Write metaobjects ⚠️ **REQUIRED**

#### Optional but Recommended:
- `read_products` - If you need to read products
- `read_orders` - If you need to read orders
- `read_customers` - If you need to read customers

### Step 4: Save the Changes

1. **Click "Save"** button at the bottom
2. **Wait for confirmation** that scopes are updated

---

## 🔄 After Adding Scopes

### Option 1: If Using Client Credentials Grant (Current Setup)

The app should automatically get the new scopes with the next token request. However, you may need to:

1. **Wait a few minutes** for Shopify to propagate the changes
2. **Or clear the token cache** by redeploying the worker:
   ```bash
   cd backend
   npx wrangler deploy
   ```
   This will force a fresh token fetch with the new scopes

### Option 2: Manual Token Refresh

If needed, you can manually test the token with new scopes:
```bash
cd backend
node get_token.js so-bysora-devstore.myshopify.com 8a0723c5e50f444bdd84394836934b6b YOUR_CLIENT_SECRET
```

---

## ✅ Verification Checklist

After adding the scopes:

- [ ] `read_metaobjects` scope is enabled
- [ ] `write_metaobjects` scope is enabled
- [ ] `read_files` scope is enabled
- [ ] `write_files` scope is enabled
- [ ] Changes are saved in Shopify Dev Dashboard
- [ ] Worker is redeployed (to get fresh token)
- [ ] Test form submission again

---

## 📝 Quick Reference: Required Scopes

Your Custom App needs these scopes for the consignment workflow:

| Scope | Purpose | Required |
|-------|---------|----------|
| `read_files` | Read uploaded files | ✅ Yes |
| `write_files` | Create file entries | ✅ Yes |
| `read_metaobjects` | Read metaobject definitions | ✅ Yes |
| `write_metaobjects` | Create metaobject entries | ✅ Yes |

---

## 🎯 Exact Steps in Shopify Dev Dashboard

1. **Partners Dashboard** → https://partners.shopify.com/
2. **Stores** → Click "so-bysora-devstore"
3. **Apps** → Click "Consign Backend"
4. **Configuration** → Left sidebar
5. **Admin API integration scopes** → Click "Configure"
6. **Search/Find and Enable**:
   - `read_metaobjects`
   - `write_metaobjects`
   - `read_files`
   - `write_files`
7. **Save** the configuration
8. **Wait 1-2 minutes** for changes to propagate
9. **Redeploy worker** (optional but recommended):
   ```bash
   cd backend
   npx wrangler deploy
   ```

---

## ⚠️ Important Notes

- **Scopes are required for Client Credentials Grant**: Your app must have these scopes enabled
- **Token refresh needed**: After adding scopes, the app needs to get a new token with the updated permissions
- **May take a few minutes**: Shopify sometimes needs a moment to propagate scope changes

---

## ✅ After Fixing

Once you've:
1. ✅ Added the required scopes
2. ✅ Saved the configuration
3. ✅ Redeployed the worker (optional)

The form should work correctly! The error will be gone and submissions will be saved to Metaobjects. 🎉