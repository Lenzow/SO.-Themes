# Setting Up the Submission Images Field

## ✅ Field Name Change

The code has been updated to use **`submission_images`** instead of `images` to avoid the reserved field name conflict.

---

## 🚀 Create the Field in Shopify

### Step-by-Step:

1. **In your Metaobject definition** (`consignment_submission`)
2. **Click "Add field"** button
3. **Configure the field**:
   - **Field name (API name)**: `submission_images`
     - ⚠️ **Must be exactly**: `submission_images` (lowercase, with underscore)
   - **Display name**: `Submission Images` or `Images` (your choice)
   - **Type**: 
     - **JSON** (if available) - Preferred ✅
     - OR **Single line text** - Will also work ✅
   - **Required**: ❌ **No** (uncheck it - images are optional)
   - **Cardinality**: **One** (single value)
     - ✅ Choose **"One"** - We store ONE JSON string that contains an array of file IDs
     - ❌ NOT "List" - The field itself is a single JSON value

4. **Click Save** on the field
5. **Save the entire Metaobject definition**

---

## ✅ What This Field Stores

The `submission_images` field stores **ONE JSON string** that contains an array of file IDs, like this:

```json
["gid://shopify/File/123456789", "gid://shopify/File/987654321"]
```

**Important**: 
- The field stores **ONE value** (a single JSON string)
- That JSON string **contains** an array inside it
- So choose **"One"** for cardinality, not "List"
- The actual images are stored separately in Shopify's Files section, and this field just references them by their IDs

---

## 🔍 Verification

After creating the field:

1. **Check the API name**:
   - In Shopify Admin > Settings > Custom data > Metaobjects > consignment_submission
   - Find the `submission_images` field
   - Click to edit it
   - Verify the **API name** is exactly `submission_images`

2. **Test the form**:
   - Submit a test entry with images
   - Check Shopify Admin > Content > Metaobjects > Consignment Submission
   - Open your test entry
   - The `submission_images` field should contain a JSON string with file IDs

---

## 📝 Notes

- ✅ Field name: `submission_images` (not `images`)
- ✅ Type: JSON (preferred) or Single line text
- ✅ Required: No (optional)
- ✅ The code is already updated to use this field name

---

## ✅ All Done!

Once you create the `submission_images` field with JSON or Single line text type, the form will work correctly and store image file IDs properly! 🎉