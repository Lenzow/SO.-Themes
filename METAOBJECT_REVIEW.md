# Metaobject Definition Review

## ✅ What Looks Good

1. **All 11 fields are present** ✓
2. **Required fields are properly marked** ✓
3. **Field types match for most fields** ✓

---

## ⚠️ Issues Found

### Issue 1: Images Field Type - CRITICAL ⚠️

**Current Setup**: 
- Field: `Images`
- Type: **Image (File)** 
- Cardinality: **List**

**Code Expects**:
- The code sends: `JSON.stringify(fileIds)` 
- This means it expects a **JSON field** or **Single line text** field, NOT an Image field

**Problem**: 
When the code tries to save the images as JSON string (like `["gid://shopify/File/123", "gid://shopify/File/456"]`), but the field is set to Image type, Shopify will reject it.

**Fix Required**:
1. Edit the `Images` field
2. Change type from **Image (File)** to **JSON** (if available) or **Single line text**
3. Keep Cardinality as **List** is fine, or change to **One** since we're storing JSON array as a string

**Why**: The code stores file IDs as a JSON array string, not actual image references. The images are uploaded separately and their IDs are stored in the `images` field.

---

### Issue 2: Field Name Case Sensitivity - CHECK ⚠️

**Check the API names** (not display names) for these fields:
- Should be `phone` (lowercase) - Make sure the API name isn't `Phone`
- Should be `brand` (lowercase) - Make sure the API name isn't `Brand`
- Should be `condition` (lowercase) - Make sure the API name isn't `Condition`

**How to check**:
1. Click on each field to edit
2. Look at the "Field name (API)" or "API name" field
3. It should match exactly (lowercase) what's in the code

---

### Issue 3: condition_description Type - OPTIONAL

**Current**: Single line text  
**Suggested**: Multi-line text (since it can be longer)

This is optional - single line text will work, but multi-line is better for longer descriptions.

---

## ✅ Correct Field Configuration

Here's what each field should be:

| Display Name | API Name | Type | Required | Notes |
|-------------|----------|------|----------|-------|
| Full Name | `full_name` | Single line text | ✅ Yes | Correct ✓ |
| Phone | `phone` | Single line text | ✅ Yes | **Check API name is lowercase** |
| Email | `email` | Email | ✅ Yes | Correct ✓ |
| Category | `category` | Single line text | ✅ Yes | Correct ✓ |
| Brand | `brand` | Single line text | ✅ Yes | **Check API name is lowercase** |
| Condition | `condition` | Single line text | ✅ Yes | **Check API name is lowercase** |
| Condition Description | `condition_description` | Single line text | ✅ Yes | Could be Multi-line text |
| Description | `description` | Multi-line text | ✅ Yes | Correct ✓ |
| Status | `status` | Single line text | ✅ Yes | Correct ✓ |
| Submission Type | `submission_type` | Single line text | ✅ Yes | Correct ✓ |
| Images | `images` | **JSON** or **Single line text** | ❌ No | **CHANGE FROM Image (File)** |

---

## 🔧 Action Items

### Priority 1: Fix Images Field
1. Go to your Metaobject definition
2. Edit the `Images` field
3. Change type from **Image (File)** to:
   - **JSON** (if available) - Preferred
   - OR **Single line text** - Will work as fallback
4. You can set Required to **No** (optional)
5. Cardinality can stay **List** or change to **One** (doesn't matter since it's a JSON string)

### Priority 2: Verify Field API Names
1. Click on each field and check the **API name** (not display name)
2. Make sure they're all lowercase with underscores where needed:
   - `full_name` ✓
   - `phone` ✓ (not `Phone`)
   - `email` ✓
   - `category` ✓
   - `brand` ✓ (not `Brand`)
   - `condition` ✓ (not `Condition`)
   - `condition_description` ✓
   - `description` ✓
   - `status` ✓
   - `submission_type` ✓
   - `images` ✓

### Priority 3: Metaobject Options (Optional Improvements)
- **Active-draft status**: ✅ ON (Good - allows saving drafts)
- **Storefronts API access**: ✅ ON (Good - allows API access)
- **Translations**: ON is fine if you need it
- Others are fine as is

---

## 🧪 After Making Changes

1. **Save the Metaobject definition**
2. **Test the form submission** again
3. **Check for errors** in the browser console
4. If it works, you should see your submission in:
   - Shopify Admin > Content > Metaobjects > Consignment Submission

---

## 📝 Notes

- The Images field stores file IDs as a JSON array string, not direct image references
- File IDs look like: `"gid://shopify/File/123456"`
- The actual images are stored separately in Shopify's Files section
- The Metaobject just references them via their IDs

---

## ✅ Summary

**Must Fix**: Images field type (change from Image to JSON or Single line text)  
**Should Check**: Field API names are lowercase  
**Optional**: condition_description could be Multi-line text  

Once the Images field is fixed, the Metaobject should work correctly!