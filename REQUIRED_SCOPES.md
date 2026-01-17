# Required API Scopes for Consignment Dashboard App

## 🎯 Overview

This document lists all API scopes needed for your Consignment Dashboard Custom App. Reference: [Shopify Access Scopes Documentation](https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration#access_scopes)

---

## ✅ **REQUIRED SCOPES** (Must Have - Current Workflow)

These scopes are **essential** for the current workflow to function:

### File Management
- ✅ **`read_files`** - Required to read uploaded files
- ✅ **`write_files`** - Required to create file entries from staged uploads

### Metaobjects
- ✅ **`read_metaobjects`** - Required to read metaobject definitions
- ✅ **`write_metaobjects`** - Required to create metaobject entries (submissions)

---

## 📋 **Complete Scope List for New App**

### 🎯 **MINIMUM** (Current Workflow Only)

Copy this if you only want current functionality:

```
read_files,write_files,read_metaobjects,write_metaobjects
```

### 🚀 **RECOMMENDED** (Current + Future Features) ⭐ USE THIS

Copy this comprehensive scope list when configuring your new Custom App. This includes everything for current workflow AND future features:

```
read_files,write_files,read_metaobjects,write_metaobjects,read_products,write_products,read_product_listings,write_product_listings,read_customers,write_customers,read_inventory,write_inventory,read_orders,write_orders,read_draft_orders,write_draft_orders,read_locations,read_fulfillments,write_fulfillments,read_discounts,write_discounts
```

### 📝 **Formatted for shopify.app.toml Configuration File**

**Minimum:**
```toml
[access_scopes]
scopes = "read_files,write_files,read_metaobjects,write_metaobjects"
```

**Recommended (Full Feature Set):**
```toml
[access_scopes]
scopes = "read_files,write_files,read_metaobjects,write_metaobjects,read_products,write_products,read_product_listings,write_product_listings,read_customers,write_customers,read_inventory,write_inventory,read_orders,write_orders,read_draft_orders,write_draft_orders,read_locations,read_fulfillments,write_fulfillments,read_discounts,write_discounts"
```

---

## 🚀 **RECOMMENDED SCOPES** (For Future Features)

Based on your workflow needs, here are scopes you should add now for future features:

### Products (CREATE PRODUCTS FROM ACCEPTED SUBMISSIONS) ⭐ HIGH PRIORITY
- ✅ **`read_products`** - Read product information (to check if product already exists)
- ✅ **`write_products`** - **CRITICAL**: Create/update products when submission is accepted
- ✅ **`read_product_listings`** - Read product listings on sales channels
- ✅ **`write_product_listings`** - Publish products to sales channels when accepted

### Customers (LINK SUBMISSIONS TO CUSTOMERS/USERS) ⭐ HIGH PRIORITY
- ✅ **`read_customers`** - **CRITICAL**: Read customer info (name, email, phone from form)
- ✅ **`write_customers`** - Create/update customers (if submission creates customer record)
- ✅ **`read_customer_payment_methods`** - Read payment methods (for payouts)
- ✅ **`write_customer_payment_methods`** - Manage payment methods (for payouts to consignors)

### Inventory (MANAGE STOCK FOR CONSIGNED ITEMS)
- ✅ **`read_inventory`** - Read inventory levels
- ✅ **`write_inventory`** - Update inventory (when item is sold or returned)

### Orders (TRACK SALES OF CONSIGNED ITEMS)
- ✅ **`read_orders`** - Read order information (to track sales)
- ✅ **`write_orders`** - Create/update orders (if manually creating orders from consignments)
- ✅ **`read_all_orders`** - Read all orders (Shopify Plus)

### Draft Orders (CREATE QUOTES/ESTIMATES)
- ✅ **`read_draft_orders`** - Read draft orders (for pricing quotes)
- ✅ **`write_draft_orders`** - Create draft orders (for sending quotes to consignors)

### Locations (MANAGE WAREHOUSE/PICKUP LOCATIONS)
- ✅ **`read_locations`** - Read store locations (for pickup/drop-off locations)

### Fulfillments (TRACK SHIPPING/RECEIVING)
- ✅ **`read_fulfillments`** - Read fulfillment information
- ✅ **`write_fulfillments`** - Create fulfillments (when items are received/shipped)

### Discounts (OFFER DISCOUNTS ON CONSIGNED ITEMS)
- ✅ **`read_discounts`** - Read discount codes
- ✅ **`write_discounts`** - Create discount codes (for special promotions)

### Price Rules (DYNAMIC PRICING)
- ✅ **`read_price_rules`** - Read price rules
- ✅ **`write_price_rules`** - Create price rules (for automatic pricing)

### Content (MANAGE STORE CONTENT)
- `read_content` - Read content (pages, blogs)
- `write_content` - Write content

### Scripts (ADD CUSTOM FUNCTIONALITY)
- `read_script_tags` - Read script tags
- `write_script_tags` - Write script tags

### Online Store (THEME MANAGEMENT)
- `read_themes` - Read theme files
- `write_themes` - Modify theme files

### Publications (CONTENT PUBLISHING)
- `read_publications` - Read publications
- `write_publications` - Write publications

---

## 🚀 **Quick Setup: Scope Recommendations**

### Minimum (Current Workflow Only)
For the **current workflow** (consignment submission only), you only need these **4 scopes**:

```
read_files,write_files,read_metaobjects,write_metaobjects
```

### Recommended (Current + Future Features) ⭐ **USE THIS**
For a **future-ready setup** that supports all planned features, use these **18 scopes**:

```
read_files,write_files,read_metaobjects,write_metaobjects,read_products,write_products,read_product_listings,write_product_listings,read_customers,write_customers,read_inventory,write_inventory,read_orders,write_orders,read_draft_orders,write_draft_orders,read_locations,read_fulfillments,write_fulfillments,read_discounts,write_discounts
```

**Why use the full list?**
- ✅ Avoid reconfiguration later
- ✅ Ready for product creation from accepted submissions
- ✅ Ready for customer linking and management
- ✅ Ready for order tracking and fulfillment
- ✅ Ready for inventory management

---

## 📝 **How to Set Scopes in Dev Dashboard**

### Step 1: Create New Custom App

1. Go to: https://partners.shopify.com/
2. Navigate to your store: **so-bysora-devstore**
3. Go to **Dev Dashboard** or **Apps**
4. Click **"Create app"** → **"Custom app"**
5. Enter app name: **"Consign Backend"** (or any name you prefer)

### Step 2: Configure Scopes

1. After creating the app, go to **Configuration**
2. Find **"Admin API integration scopes"**
3. Click **"Configure"**
4. **Search and enable** these scopes:

#### Required for Current Workflow:
   - ✅ `read_files`
   - ✅ `write_files`
   - ✅ `read_metaobjects`
   - ✅ `write_metaobjects`

#### Recommended for Future Features:
   - ✅ `read_products` (Check existing products)
   - ✅ `write_products` (Create products from accepted submissions) ⭐
   - ✅ `read_product_listings` (Manage listings)
   - ✅ `write_product_listings` (Publish products) ⭐
   - ✅ `read_customers` (Link submissions to customers) ⭐
   - ✅ `write_customers` (Create customer records)
   - ✅ `read_inventory` (Check stock)
   - ✅ `write_inventory` (Manage stock)
   - ✅ `read_orders` (Track sales)
   - ✅ `write_orders` (Create orders)
   - ✅ `read_draft_orders` (Create quotes)
   - ✅ `write_draft_orders` (Send quotes)
   - ✅ `read_locations` (Pickup/drop-off locations)
   - ✅ `read_fulfillments` (Track shipping)
   - ✅ `write_fulfillments` (Create fulfillments)
   - ✅ `read_discounts` (Read discount codes)
   - ✅ `write_discounts` (Create discounts)

5. **Click "Save"**

**💡 Tip**: Enable all recommended scopes now to avoid having to reconfigure later when adding features!

### Step 3: Copy Credentials

1. Go to **Settings** (or App Overview)
2. Copy the **Client ID**
3. Copy the **Client Secret**
4. Update your Cloudflare Worker secrets:
   ```bash
   cd backend
   npx wrangler secret put SHOPIFY_CLIENT_ID
   # Paste new Client ID
   
   npx wrangler secret put SHOPIFY_CLIENT_SECRET
   # Paste new Client Secret
   
   # Shop domain stays the same
   npx wrangler secret put SHOPIFY_SHOP_DOMAIN
   # Enter: so-bysora-devstore.myshopify.com
   ```

### Step 4: Deploy Worker

```bash
cd backend
npx wrangler deploy
```

---

## 🔍 **Scope Reference**

### Complete List of All Shopify Admin API Scopes

For reference, here are all available Admin API scopes (per [Shopify documentation](https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration#access_scopes)):

**Products & Inventory:**
- `read_products`
- `write_products`
- `read_product_listings`
- `write_product_listings`
- `read_inventory`
- `write_inventory`

**Orders:**
- `read_orders`
- `write_orders`
- `read_draft_orders`
- `write_draft_orders`
- `read_all_orders` (plus)
- `read_order_edits` (plus)

**Customers:**
- `read_customers`
- `write_customers`
- `read_customer_payment_methods`
- `write_customer_payment_methods`

**Files & Media:**
- `read_files` ✅ **REQUIRED**
- `write_files` ✅ **REQUIRED**

**Content:**
- `read_content`
- `write_content`
- `read_themes`
- `write_themes`

**Metaobjects & Metafields:**
- `read_metaobjects` ✅ **REQUIRED**
- `write_metaobjects` ✅ **REQUIRED**
- `read_metaobject_definitions`
- `write_metaobject_definitions`

**Scripts:**
- `read_script_tags`
- `write_script_tags`

**Publishing:**
- `read_publications`
- `write_publications`

**Sales Channels:**
- `read_sales_channels`
- `read_channels`

**Locations:**
- `read_locations`

**And many more...**

---

## ⚠️ **Important Notes**

1. **Use Least Privilege**: Only request scopes you actually need
2. **Required for Client Credentials Grant**: All required scopes must be enabled
3. **Token Refresh**: After adding scopes, you may need to redeploy to get a fresh token
4. **Documentation**: Full scope list: https://shopify.dev/docs/api/usage/access-scopes

---

## ✅ **Summary**

### 📋 **Copy-Paste Ready Scope Strings**

**Option 1: Minimum (Current Workflow Only)**
```
read_files,write_files,read_metaobjects,write_metaobjects
```

**Option 2: Recommended (Current + Future) ⭐ USE THIS**
```
read_files,write_files,read_metaobjects,write_metaobjects,read_products,write_products,read_product_listings,write_product_listings,read_customers,write_customers,read_inventory,write_inventory,read_orders,write_orders,read_draft_orders,write_draft_orders,read_locations,read_fulfillments,write_fulfillments,read_discounts,write_discounts
```

### 🎯 **What Each Scope Enables**

| Scope | Use Case | Priority |
|-------|----------|----------|
| `read_files` | Read uploaded images | ✅ Required |
| `write_files` | Create file entries | ✅ Required |
| `read_metaobjects` | Read submission definitions | ✅ Required |
| `write_metaobjects` | Create submissions | ✅ Required |
| `read_products` | Check if product exists | 🔮 Future |
| `write_products` | **Create product from accepted submission** | 🔮 Future ⭐ |
| `read_product_listings` | Check product listings | 🔮 Future |
| `write_product_listings` | **Publish product to store** | 🔮 Future ⭐ |
| `read_customers` | **Get customer name/email from form** | 🔮 Future ⭐ |
| `write_customers` | Create customer records | 🔮 Future |
| `read_inventory` | Check stock levels | 🔮 Future |
| `write_inventory` | Update stock | 🔮 Future |
| `read_orders` | Track sales of consigned items | 🔮 Future |
| `write_orders` | Create orders manually | 🔮 Future |
| `read_draft_orders` | Read pricing quotes | 🔮 Future |
| `write_draft_orders` | Create pricing quotes | 🔮 Future |
| `read_locations` | Pickup/drop-off locations | 🔮 Future |
| `read_fulfillments` | Track shipping | 🔮 Future |
| `write_fulfillments` | Create fulfillments | 🔮 Future |
| `read_discounts` | Read discount codes | 🔮 Future |
| `write_discounts` | Create discount codes | 🔮 Future |

**⭐ Recommended**: Copy the **Option 2** scope string when creating your new Custom App in the Dev Dashboard!