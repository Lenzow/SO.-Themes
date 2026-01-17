# Troubleshooting "Submission Failed" Error

## 🔍 Debugging Steps

### Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12 or Cmd+Option+I on Mac)
2. Go to the **Console** tab
3. Try submitting the form again
4. Look for error messages - they will now show **detailed error information**

### Step 2: Check Network Tab
1. In Developer Tools, go to the **Network** tab
2. Try submitting the form again
3. Look for failed requests (they'll be in red)
4. Click on the failed request (usually `/api/sign-upload` or `/api/submit-consign`)
5. Check the **Response** tab to see the actual error message

### Step 3: Common Issues & Solutions

## ❌ Issue 1: "Configuration Error: Secrets not set"

**Error Message**: `Configuration Error: Secrets not set...`

**Cause**: The Cloudflare Worker secrets are not configured.

**Solution**:
```bash
cd backend
npx wrangler secret put SHOPIFY_CLIENT_ID
# Enter: 8a0723c5e50f444bdd84394836934b6b

npx wrangler secret put SHOPIFY_CLIENT_SECRET
# Enter your Client Secret (get it from Shopify Dev Dashboard)

npx wrangler secret put SHOPIFY_SHOP_DOMAIN
# Enter: so-bysora-devstore.myshopify.com

# Then redeploy
npx wrangler deploy
```

---

## ❌ Issue 2: "Authentication failed" or "Token fetch failed"

**Error Message**: `Authentication failed: Token fetch failed...` or `Missing required credentials...`

**Causes**:
- Wrong Client ID or Client Secret
- Client Secret not set correctly
- Shop domain incorrect

**Solution**:
1. Verify your secrets are correct:
   ```bash
   # Check if secrets are set (won't show values for security)
   npx wrangler secret list
   ```

2. Verify Client ID and Secret from Shopify:
   - Go to: https://partners.shopify.com/
   - Navigate to: Your Store > Apps > Consign Backend > Settings
   - Copy the **Client ID** and **Client Secret** again
   - Make sure there are no extra spaces when copying

3. Test token fetch manually:
   ```bash
   cd backend
   node get_token.js so-bysora-devstore.myshopify.com 8a0723c5e50f444bdd84394836934b6b YOUR_CLIENT_SECRET
   ```
   If this fails, the credentials are wrong.

4. Reset secrets:
   ```bash
   npx wrangler secret put SHOPIFY_CLIENT_ID
   npx wrangler secret put SHOPIFY_CLIENT_SECRET
   npx wrangler secret put SHOPIFY_SHOP_DOMAIN
   npx wrangler deploy
   ```

---

## ❌ Issue 3: "Shopify API Error" or "Invalid response from Shopify"

**Error Message**: `Shopify API Error: ...` or `Invalid response from Shopify`

**Causes**:
- App doesn't have required permissions/scopes
- Metaobject definition doesn't exist
- API version mismatch

**Solution**:
1. **Check App Permissions**:
   - Go to: Shopify Dev Dashboard > Your App > Configuration
   - Ensure these scopes are enabled:
     - `read_files`
     - `write_files`
     - `read_metaobjects`
     - `write_metaobjects`

2. **Verify Metaobject Definition**:
   - Go to: Shopify Admin > Settings > Custom Data > Metaobjects
   - Ensure `consignment_submission` metaobject exists
   - Check that all required fields exist:
     - `full_name`, `email`, `phone`, `category`, `brand`, `condition`, `condition_description`, `description`, `status`, `submission_type`, `images`

3. **Check API Version**:
   - The worker uses `2025-10` API version
   - Verify this is available in your Shopify store

---

## ❌ Issue 4: "Upload Setup Failed"

**Error Message**: `Upload Setup Failed` or errors during `/api/sign-upload`

**Causes**:
- Token fetch failing (see Issue 2)
- File validation failing
- Missing staged uploads permissions

**Solution**:
1. Check if images meet requirements:
   - Max 5 files
   - File types: JPEG, PNG, WebP, HEIC
   - Max size: 20MB per file

2. Check browser console for specific file errors

---

## ❌ Issue 5: "Metaobject creation errors"

**Error Message**: `Metaobject creation errors: field_name: error message`

**Causes**:
- Missing required fields
- Invalid field values
- Field type mismatch

**Solution**:
1. Check which field is causing the error from the error message
2. Verify the field exists in your Metaobject definition
3. Check that the field type matches (text vs number, etc.)
4. Ensure required fields are being sent

---

## 🔧 Quick Diagnostic Script

Run this to test your setup:

```bash
cd backend

# Test 1: Check secrets are set
echo "Checking secrets..."
npx wrangler secret list

# Test 2: Test token fetch
echo "Testing token fetch..."
node get_token.js so-bysora-devstore.myshopify.com 8a0723c5e50f444bdd84394836934b6b YOUR_CLIENT_SECRET

# Test 3: Check worker logs (after deployment)
npx wrangler tail
```

---

## 📝 Checking Worker Logs

To see what's happening in real-time:

```bash
cd backend
npx wrangler tail
```

Then try submitting the form. You'll see:
- Token fetch attempts
- GraphQL requests
- Error messages with details

---

## ✅ After Fixing Errors

1. **Deploy the worker**:
   ```bash
   cd backend
   npx wrangler deploy
   ```

2. **Clear browser cache** and try again

3. **Check the browser console** - errors should now be more descriptive

---

## 🆘 Still Having Issues?

1. **Copy the exact error message** from browser console
2. **Check Cloudflare Worker logs** using `npx wrangler tail`
3. **Verify all secrets are set** using `npx wrangler secret list`
4. **Test token fetch manually** using `get_token.js`

The improved error handling will now show you the **exact error message** instead of just "Submission failed", making it much easier to diagnose the issue!