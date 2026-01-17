# Metaobject Setup Guide - consignment_submission

## ✅ Error Message
**Error**: `No metaobject definition exists for type "consignment_submission"`

This means you need to create the Metaobject definition in your Shopify Admin.

---

## 🚀 Step-by-Step Setup

### Step 1: Access Metaobjects in Shopify Admin

1. Log into your Shopify Admin: https://so-bysora-devstore.myshopify.com/admin
2. Go to **Settings** (bottom left)
3. Click **Custom data** (in the left sidebar)
4. Click **Metaobjects** (in the top navigation)

### Step 2: Create New Metaobject Definition

1. Click **Add definition** button
2. In the **Type name** field, enter: `consignment_submission`
   - ⚠️ **Important**: This must be EXACTLY `consignment_submission` (lowercase, with underscore)
   - The type name will become: `consignment_submission` (this is used in the code)

3. In the **Display name** field, enter: `Consignment Submission`
   - This is just for display in the admin

### Step 3: Add Fields

Add each field below one by one. Click **Add field** for each:

#### Field 1: Full Name
- **Field name (API name)**: `full_name`
- **Display name**: Full Name
- **Type**: Single line text
- **Required**: ✅ Yes

#### Field 2: Email
- **Field name (API name)**: `email`
- **Display name**: Email
- **Type**: Email
- **Required**: ❌ No (optional)

#### Field 3: Phone
- **Field name (API name)**: `phone`
- **Display name**: Phone
- **Type**: Single line text
- **Required**: ✅ Yes

#### Field 4: Category
- **Field name (API name)**: `category`
- **Display name**: Category
- **Type**: Single line text
- **Required**: ✅ Yes

#### Field 5: Brand
- **Field name (API name)**: `brand`
- **Display name**: Brand
- **Type**: Single line text
- **Required**: ✅ Yes

#### Field 6: Condition
- **Field name (API name)**: `condition`
- **Display name**: Condition
- **Type**: Single line text
- **Required**: ✅ Yes

#### Field 7: Condition Description
- **Field name (API name)**: `condition_description`
- **Display name**: Condition Description
- **Type**: Multi-line text
- **Required**: ❌ No (optional)

#### Field 8: Description
- **Field name (API name)**: `description`
- **Display name**: Description
- **Type**: Multi-line text
- **Required**: ❌ No (optional)

#### Field 9: Status
- **Field name (API name)**: `status`
- **Display name**: Status
- **Type**: Single line text
- **Required**: ✅ Yes
- **Default value**: `New` (optional, but recommended)

#### Field 10: Submission Type
- **Field name (API name)**: `submission_type`
- **Display name**: Submission Type
- **Type**: Single line text
- **Required**: ✅ Yes
- **Default value**: `Quick Quote` (optional, but recommended)

#### Field 11: Submission Images
- **Field name (API name)**: `submission_images`
- **Display name**: Submission Images (or "Images")
- **Type**: JSON (if available) or Single line text
- **Required**: ❌ No (optional - will be empty if no images uploaded)
- **Cardinality**: **One** (single value - stores ONE JSON string that contains an array)
- **Note**: This stores file IDs as a JSON array string (e.g., `["gid://shopify/File/123", "gid://shopify/File/456"]`)

### Step 4: Save the Metaobject Definition

1. Review all fields are added correctly
2. Click **Save** button
3. Wait for Shopify to confirm the definition is created

---

## 📋 Quick Reference: All Fields

| Field Name (API) | Display Name | Type | Required |
|-----------------|--------------|------|----------|
| `full_name` | Full Name | Single line text | ✅ Yes |
| `email` | Email | Email | ❌ No |
| `phone` | Phone | Single line text | ✅ Yes |
| `category` | Category | Single line text | ✅ Yes |
| `brand` | Brand | Single line text | ✅ Yes |
| `condition` | Condition | Single line text | ✅ Yes |
| `condition_description` | Condition Description | Multi-line text | ❌ No |
| `description` | Description | Multi-line text | ❌ No |
| `status` | Status | Single line text | ✅ Yes |
| `submission_type` | Submission Type | Single line text | ✅ Yes |
| `submission_images` | Submission Images | JSON or Single line text | ❌ No |

---

## ✅ Verification

After creating the Metaobject definition:

1. **Verify it exists**:
   - Go to: Shopify Admin > Settings > Custom data > Metaobjects
   - You should see "Consignment Submission" in the list
   - Click on it to verify all fields are there

2. **Test the form**:
   - Go to your consignment submission page
   - Try submitting a test entry
   - The error should be gone!

3. **Check created entries**:
   - Go to: Shopify Admin > Content > Metaobjects > Consignment Submission
   - You should see your test submission there

---

## ⚠️ Important Notes

1. **Type Name Must Match**: The type name `consignment_submission` must match EXACTLY (lowercase, underscore). This is hardcoded in the worker.js file.

2. **Field Names Must Match**: All field names (API names) must match exactly as shown in the table above. They're case-sensitive.

3. **Required Fields**: Make sure all required fields are marked as required in Shopify. The code expects these to be present.

4. **Images Field**: The images field stores JSON. Shopify should automatically set this as JSON type. If not available, use "Single line text" and it should still work.

---

## 🔧 If You Still See Errors

1. **Double-check the type name**: It must be `consignment_submission` (not `Consignment_Submission` or `consignment-submission`)

2. **Check field names**: Compare each field's API name in Shopify with the table above
   - ⚠️ **Important**: The images field should be named `submission_images` (not `images`)

3. **Clear cache**: Try clearing your browser cache and submitting again

4. **Check worker logs**: Run `npx wrangler tail` in the backend directory to see detailed errors

---

## 📸 Visual Guide Locations

- **Shopify Admin**: `https://so-bysora-devstore.myshopify.com/admin`
- **Settings**: Bottom left of admin panel
- **Custom data**: Left sidebar in Settings
- **Metaobjects**: Top navigation in Custom data section
- **Content > Metaobjects**: Where you view/edit submissions after creation

---

Once the Metaobject definition is created, the form should work correctly! 🎉