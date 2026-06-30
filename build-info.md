Build a Node.js + Express backend automation system that integrates Shopify, 
Google Sheets, and the Anthropic Claude API to automatically generate 
SEO-optimized product titles and descriptions for a fashion e-commerce store.

---

SYSTEM OVERVIEW

When a new product is created on Shopify, a webhook fires to this backend. 
The backend reads the product details, fetches a keyword list from Google 
Sheets, uses Claude AI to analyze the product and pick the best matching 
keywords, generates a complete SEO title + formatted description, then 
writes everything back to Shopify and sets the product to draft status.

---

TECH STACK

- Runtime: Node.js
- Framework: Express
- AI: Anthropic Claude API (claude-sonnet-4-6)
- Keyword Source: Google Sheets API v4
- Store Integration: Shopify Admin REST API (2024-01)
- Hosting Target: Render.com
- Environment config: dotenv

---

ENVIRONMENT VARIABLES REQUIRED

SHOPIFY_STORE_URL=https://yourstore.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxx
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
ANTHROPIC_API_KEY=sk-ant-xxxx
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

---

FILE STRUCTURE

/src
  index.js           — Express server entry point
  /routes
    webhook.js       — POST /webhook/product-created
  /services
    shopify.js       — Shopify API read/write functions
    sheets.js        — Google Sheets keyword fetcher
    claude.js        — Claude AI title + description generator
    processor.js     — Main orchestration logic
  /utils
    slugify.js       — Convert title to URL handle
    verify.js        — Shopify webhook HMAC verification
.env
package.json

---

WEBHOOK ROUTE — POST /webhook/product-created

1. Verify the request is genuinely from Shopify using HMAC-SHA256 
   signature verification against SHOPIFY_WEBHOOK_SECRET.
   If verification fails, return 401.

2. Parse the product payload from the request body.

3. Pass the product to processor.js and return 200 immediately 
   (Shopify requires a fast response — do the processing async).

---

SHOPIFY SERVICE — shopify.js

Function: getProduct(productId)
- GET /admin/api/2024-01/products/{productId}.json
- Returns: title, body_html, tags, images, variants, handle

Function: updateProduct(productId, payload)
- PUT /admin/api/2024-01/products/{productId}.json
- Sends: new title, new body_html, new handle, updated variants, 
  status: "draft"
- The variants update must set the size options to exactly:
  ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20"]
  where 20 = 3XL. Keep all other variant fields (price, sku) unchanged.

---

SHEETS SERVICE — sheets.js

Function: getKeywords()
- Connect using Google Service Account credentials from env vars
- Read the keyword sheet by GOOGLE_SHEETS_ID
- The sheet has keywords in column A and a color/priority indicator 
  in column B (values: "green" or "orange")
- Return ONLY rows where column B is "green" or "orange"
- Return as a plain array of keyword strings
- Cache the result in memory for 30 minutes to avoid hammering the 
  Sheets API on every product

---

CLAUDE SERVICE — claude.js

Function: generateProductContent(product, keywords)

System prompt:
"You are an expert SEO copywriter for a women's fashion e-commerce store. 
You write product titles and descriptions that rank well on Google Shopping 
and convert browsers into buyers. You always follow the exact output format 
provided. Never add commentary, headers, or extra text outside the format."

User prompt:
"Here is a Shopify product that needs an SEO-optimized title and description.

PRODUCT INFO:
Title: {product.title}
Tags: {product.tags}
Existing Description: {product.body_html stripped of HTML}

AVAILABLE KEYWORDS (high-value, from Google Ads Keyword Planner):
{keywords joined by comma}

YOUR TASK:

1. ANALYZE the product — identify its color, length, neckline, sleeve 
   style, silhouette, and occasion type based on the title, tags, 
   and description.

2. SELECT 3 to 4 keywords from the list above that best match this 
   product. Prioritize specificity and search volume relevance.

3. WRITE a new product title by combining those 3-4 keywords naturally. 
   The title should be 60-80 characters. No brand name. No punctuation 
   between keywords except spaces. Example format:
   Black Mini Dress Mock Neck Long Sleeve Bodycon Style

4. WRITE a product description in EXACTLY this format:

[One sentence intro paragraph about the dress — style, occasion, feeling]

Why You'll Love It:
- [Benefit or feature 1]
- [Benefit or feature 2]  
- [Benefit or feature 3]
- [Benefit or feature 4]

[One closing sentence about versatility or styling]

Size Chart:
| Size | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20(3XL) |

RESPOND IN THIS EXACT JSON FORMAT — nothing else:
{
  \"title\": \"the new SEO title here\",
  \"description\": \"the full description here with \\n for line breaks\"
}"

- Parse the JSON response from Claude
- Return { title, description }
- If JSON parsing fails, retry once with a stricter prompt
- If it fails again, throw an error and log it

---

PROCESSOR SERVICE — processor.js

Function: processProduct(product)

Steps:
1. Call getKeywords() from sheets.js
2. Call generateProductContent(product, keywords) from claude.js
3. Build the update payload:
   - title: claude output title
   - body_html: convert claude description newlines to <br> tags, 
     wrap in <p> tags appropriately
   - handle: slugify the new title using slugify.js
   - status: "draft"
   - variants: map existing variants, replace size option with 
     the standard size array. If the product currently has fewer 
     than 10 variants, add new variant entries for the missing sizes 
     using the same price as the first variant.
4. Call updateProduct(productId, payload) from shopify.js
5. Log success: product ID, old title, new title

---

SLUGIFY UTIL — slugify.js

Function: slugify(title)
- Lowercase everything
- Replace spaces with hyphens
- Remove any characters that are not alphanumeric or hyphens
- Example: "Black Mini Dress Mock Neck" → "black-mini-dress-mock-neck"

---

WEBHOOK VERIFICATION UTIL — verify.js

Function: verifyShopifyWebhook(req)
- Read the raw request body
- Compute HMAC-SHA256 using SHOPIFY_WEBHOOK_SECRET
- Compare against X-Shopify-Hmac-Sha256 header
- Return true if valid, false if not
- Use crypto module from Node.js stdlib — no extra packages

---

ERROR HANDLING

- All service functions must use try/catch
- On any error in processProduct, log the full error with product ID
- Never crash the server on a bad product — catch at the processor level
- If Claude returns malformed JSON twice, skip the product and log a 
  warning with the raw Claude output for debugging

---

PACKAGES NEEDED

express
@anthropic-ai/sdk
googleapis
crypto (built-in)
dotenv
nodemon (dev only)

---

README.md MUST INCLUDE

1. All environment variables with descriptions
2. How to create the Shopify webhook pointing to /webhook/product-created
3. How to set up Google Service Account and share the sheet with it
4. How to deploy to Render.com
5. How to test locally using ngrok