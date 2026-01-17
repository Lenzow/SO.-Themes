# Step-by-Step: App Setup Guide for Consignment Backend V2

## 🎯 Overview

This guide will walk you through configuring your Custom App "Consignment backend V2" in the Shopify Dev Dashboard step by step.

---

## 📋 Pre-Setup Checklist

Before starting, have ready:
- ✅ Your Cloudflare Worker URL (e.g., `https://consign-backend.ayoubelgrine.workers.dev`)
- ✅ Complete scope list (provided below)
- ✅ Shop domain: `so-bysora-devstore.myshopify.com`

---

## 🚀 Step-by-Step Configuration

### Step 1: App Name ✅

**Field**: App name  
**Current Value**: "Consignment backend V2"  
**Action**: ✅ Keep as is (or change if you prefer)  
**Limit**: 30 characters (you have 22/30)

**Notes**: This is just for display in the admin. It doesn't affect functionality.

---

### Step 2: URLs Configuration

#### 2.1 App URL

**Field**: App URL  
**Current Value**: `https://example.com`  
**Action**: ⚠️ **REPLACE THIS**  

**For Custom App (Non-Embedded Backend Only)**:
- Since this is a backend-only app (not embedded in Shopify admin), you can use:
  - Option 1: Your Cloudflare Worker URL:
    ```
    https://consign-backend.ayoubelgrine.workers.dev
    ```
  - Option 2: Placeholder URL (since app isn't accessed directly):
    ```
    https://example.com
    ```

**Recommendation**: Use your Cloudflare Worker URL if you have one, otherwise leave `https://example.com`

#### 2.2 Embed App in Shopify Admin

**Checkbox**: "Embed app in Shopify admin"  
**Current State**: ✅ Checked  
**Action**: ❌ **UNCHECK THIS**

**Why**: This is a backend-only API app that doesn't need to be embedded in the Shopify admin. It's accessed via API only.

#### 2.3 Preferences URL (Optional)

**Field**: Preferences URL (optional)  
**Current Value**: Empty  
**Action**: ✅ Leave empty

**Notes**: Only needed if you want a settings page in Shopify admin. Not required for backend-only apps.

---

### Step 3: Webhooks API Version

**Field**: Webhooks API Version  
**Current Value**: `2026-01`  
**Action**: ✅ Keep as is (or use `2025-10` to match your worker)

**Note**: Your worker uses `2025-10`, but `2026-01` should work fine too.

---

### Step 4: Access - Scopes Configuration ⭐ CRITICAL

#### 4.1 Scopes (Required)

**Field**: Scopes  
**Current Value**: Partially filled  
**Action**: ⚠️ **REPLACE WITH COMPLETE LIST**

**Copy and paste this complete scope list**:

```
read_files,write_files,read_metaobjects,write_metaobjects,read_products,write_products,read_product_listings,write_product_listings,read_customers,write_customers,read_inventory,write_inventory,read_orders,write_orders,read_draft_orders,write_draft_orders,read_locations,read_fulfillments,write_fulfillments,read_discounts,write_discounts
```

**What each scope enables**:
- `read_files, write_files` - Upload and manage images
- `read_metaobjects, write_metaobjects` - Create submission entries
- `read_products, write_products` - Create products from accepted submissions
- `read_product_listings, write_product_listings` - Publish products
- `read_customers, write_customers` - Link submissions to customers
- `read_inventory, write_inventory` - Manage stock
- `read_orders, write_orders` - Track sales
- `read_draft_orders, write_draft_orders` - Create pricing quotes
- `read_locations` - Pickup/drop-off locations
- `read_fulfillments, write_fulfillments` - Track shipping
- `read_discounts, write_discounts` - Manage discounts

#### 4.2 Optional Scopes

**Field**: Optional scopes  
**Current Value**: Empty  
**Action**: ✅ Leave empty for now

**Notes**: Optional scopes can be requested dynamically later if needed.

#### 4.3 Use Legacy Install Flow

**Checkbox**: "Use legacy install flow"  
**Current State**: Not checked  
**Action**: ✅ **LEAVE UNCHECKED**

**Why**: You're using Client Credentials Grant (new workflow), not legacy OAuth flow.

---

### Step 5: Redirect URLs

**Field**: Redirect URLs  
**Current Value**: Empty  
**Action**: ✅ **LEAVE EMPTY**

**Why**: 
- Custom Apps using Client Credentials Grant don't need redirect URLs
- Redirect URLs are only needed for OAuth authorization flows
- Your app doesn't require user authorization (it's server-to-server)

**Note**: If Shopify shows a warning about empty redirect URLs, you can ignore it for Custom Apps with Client Credentials Grant.

---

### Step 6: POS (Point of Sale) - SKIP

**Section**: POS  
**Current State**: Collapsed (>)  
**Action**: ✅ **Leave collapsed, don't configure**

**Why**: Not needed for consignment backend.

---

### Step 7: App Proxy - SKIP

**Section**: App proxy  
**Current State**: Collapsed (>)  
**Action**: ✅ **Leave collapsed, don't configure**

**Why**: Not needed for backend API app.

---

### Step 8: Release the App Version

**Button**: "Release" (bottom right)  
**Action**: ✅ **Click "Release"**

**What happens**:
1. Shopify validates your configuration
2. App version is created and activated
3. You'll see the app version become "Active"

**Note**: You may see warnings about URLs - these are usually OK for backend-only Custom Apps.

---

## ✅ Final Configuration Summary

After completing all steps, your app should have:

| Field | Value |
|-------|-------|
| **App name** | Consignment backend V2 |
| **App URL** | `https://consign-backend.ayoubelgrine.workers.dev` or `https://example.com` |
| **Embed app** | ❌ Unchecked |
| **Preferences URL** | (empty) |
| **Webhooks API Version** | `2026-01` or `2025-10` |
| **Scopes** | Complete list (21 scopes) |
| **Optional scopes** | (empty) |
| **Use legacy install flow** | ❌ Unchecked |
| **Redirect URLs** | (empty) |

---

## 🔑 After Releasing: Get Credentials

After clicking "Release", get your app credentials:

### Step 1: Go to App Settings

1. After releasing, go back to the app overview
2. Click on **"Settings"** or **"Overview"**
3. Look for **"Client credentials"** section

### Step 2: Copy Credentials

1. **Client ID** - Copy this (starts with letters/numbers)
2. **Client Secret** - Copy this (starts with `shpss_`)

### Step 3: Update Cloudflare Worker Secrets

```bash
cd backend

# Set Client ID
npx wrangler secret put SHOPIFY_CLIENT_ID
# Paste your new Client ID

# Set Client Secret
npx wrangler secret put SHOPIFY_CLIENT_SECRET
# Paste your new Client Secret

# Verify Shop Domain (should already be set)
npx wrangler secret put SHOPIFY_SHOP_DOMAIN
# Enter: so-bysora-devstore.myshopify.com
```

### Step 4: Deploy Worker

```bash
npx wrangler deploy
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "App URL is required"
**Solution**: Enter `https://example.com` or your Cloudflare Worker URL

### Issue 2: "Redirect URLs required"
**Solution**: For Custom Apps with Client Credentials Grant, this warning can usually be ignored. You can add a placeholder if required:
```
https://example.com/auth/callback
```

### Issue 3: "Invalid scope"
**Solution**: Double-check the scope list - make sure there are no typos or extra spaces

### Issue 4: Can't find Client ID/Secret after release
**Solution**: 
- Go to app overview page
- Click "Settings" or look for "API credentials"
- Client ID and Secret should be visible there

---

## ✅ Verification Checklist

After setup, verify:

- [ ] App name is set
- [ ] App URL is configured (even if placeholder)
- [ ] "Embed app" is **unchecked**
- [ ] All scopes are added (21 scopes total)
- [ ] "Use legacy install flow" is **unchecked**
- [ ] Redirect URLs are empty (or placeholder if required)
- [ ] App version is **Released** and **Active**
- [ ] Client ID and Client Secret are copied
- [ ] Worker secrets are updated
- [ ] Worker is deployed
- [ ] Test form submission works

---

## 🎯 Quick Copy-Paste Reference

### Complete Scope List:
```
read_files,write_files,read_metaobjects,write_metaobjects,read_products,write_products,read_product_listings,write_product_listings,read_customers,write_customers,read_inventory,write_inventory,read_orders,write_orders,read_draft_orders,write_draft_orders,read_locations,read_fulfillments,write_fulfillments,read_discounts,write_discounts
```

### App URL Options:
- Option 1 (Worker URL): `https://consign-backend.ayoubelgrine.workers.dev`
- Option 2 (Placeholder): `https://example.com`

---

## 🎉 After Setup

Once everything is configured:

1. ✅ App version is **Released** and **Active**
2. ✅ Credentials are saved in Cloudflare Worker
3. ✅ Worker is deployed
4. ✅ Test the consignment form - it should work!

---

## 📝 Next Steps

After setup is complete, refer to:
- `SETUP_QUICK_REFERENCE.md` - For quick credential reference
- `TROUBLESHOOTING.md` - If you encounter any errors
- `METAOBJECT_SETUP_GUIDE.md` - Ensure Metaobject is created

Good luck! 🚀