# Shopify SEO Automation

Node.js + Express backend that listens for Shopify product creation webhooks, pulls SEO keywords from Google Sheets, generates optimized titles and descriptions with Claude AI, and writes the results back to Shopify.

## How It Works

1. A new product is created in Shopify.
2. Shopify sends a webhook to `POST /webhook/product-created`.
3. The server verifies the webhook signature, responds with `200 OK` immediately, and processes the product asynchronously.
4. Keywords are fetched from Google Sheets (cached for 30 minutes).
5. Claude generates an SEO title and formatted description.
6. The product is updated in Shopify with the new content, standardized size variants, and `draft` status.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

| Variable | Description |
|---|---|
| `SHOPIFY_STORE_URL` | Your Shopify store URL, e.g. `https://yourstore.myshopify.com` |
| `SHOPIFY_CLIENT_ID` | Client ID from Dev Dashboard → your app → Settings |
| `SHOPIFY_CLIENT_SECRET` | Client secret (`shpss_...`) from the same app — used for webhook HMAC |
| `SHOPIFY_WEBHOOK_SECRET` | Same as `SHOPIFY_CLIENT_SECRET` — used to verify webhook HMAC signatures |
| `SHOPIFY_ACCESS_TOKEN` | **Required for production stores.** Permanent token from one-time OAuth (`/auth/install`) |
| `SHOPIFY_OAUTH_REDIRECT_URI` | (Optional) OAuth callback URL — defaults to `{your-server}/auth/callback` |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |
| `GOOGLE_SHEETS_ID` | Google Spreadsheet ID containing your keyword list |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email with read access to the sheet |
| `GOOGLE_PRIVATE_KEY` | Service account private key (use `\n` for line breaks in `.env`) |
| `PORT` | (Optional) Server port, defaults to `3000` |

## Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

The server starts on `http://localhost:3000`. Health check: `GET /health`.

## Testing Locally with ngrok

Shopify webhooks require a publicly accessible HTTPS URL.

1. Start the server: `npm run dev`
2. Install and run [ngrok](https://ngrok.com/): `ngrok http 3000`
3. Copy the HTTPS forwarding URL (e.g. `https://abc123.ngrok.io`)
4. Register the Shopify webhook (see below) using:
   `https://abc123.ngrok.io/webhook/product-created`
5. Create a test product in Shopify and watch the server logs

## Shopify App Credentials (Dev Dashboard)

### Production stores (your case — aflairboutique)

**Client credentials do NOT work on live/production stores** — you will get `shop_not_permitted`. Use a one-time OAuth flow instead:

1. In **Dev Dashboard → your app → Settings**, add this to **Allowed redirection URL(s)**:
   ```
   https://YOUR-NGROK-URL.ngrok-free.app/auth/callback
   ```
2. Add to `.env`:
   ```
   SHOPIFY_OAUTH_REDIRECT_URI=https://YOUR-NGROK-URL.ngrok-free.app/auth/callback
   ```
3. Start the server and ngrok, then open in your browser:
   ```
   https://YOUR-NGROK-URL.ngrok-free.app/auth/install
   ```
4. Approve the app in Shopify — you'll get a permanent `SHOPIFY_ACCESS_TOKEN`
5. Paste it into `.env` and restart the server
6. Register the webhook:
   ```bash
   npm run register-webhook -- https://YOUR-NGROK-URL.ngrok-free.app/webhook/product-created
   ```

### Dev stores only

Dev stores in the same Partner organization can use client credentials (no `SHOPIFY_ACCESS_TOKEN` needed). Access tokens refresh automatically every ~24 hours.

1. Go to [dev.shopify.com](https://dev.shopify.com) or [partners.shopify.com](https://partners.shopify.com)
2. Open your app → **Settings**
3. Copy **Client ID** → `SHOPIFY_CLIENT_ID`
4. Copy **Client secret** (`shpss_...`) → `SHOPIFY_CLIENT_SECRET` and `SHOPIFY_WEBHOOK_SECRET`
5. Ensure the app is installed on your store with `read_products` and `write_products` scopes

## Shopify Webhook Setup

Create a webhook in your Shopify admin or via the Admin API:

- **Event:** Product creation
- **Format:** JSON
- **URL:** `https://your-domain.com/webhook/product-created`

### Via Shopify Admin

1. Go to **Settings → Notifications → Webhooks**
2. Click **Create webhook**
3. Select **Product creation** as the event
4. Set format to **JSON**
5. Enter your webhook URL
6. Use your app's **Client secret** (`shpss_...`) as `SHOPIFY_WEBHOOK_SECRET`

### Via Admin API

```bash
curl -X POST "https://yourstore.myshopify.com/admin/api/2024-01/webhooks.json" \
  -H "X-Shopify-Access-Token: YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook": {
      "topic": "products/create",
      "address": "https://your-domain.com/webhook/product-created",
      "format": "json"
    }
  }'
```

## Google Sheets Setup

### Spreadsheet Format

| Column A | Column B |
|---|---|
| Keyword | Priority (`green` or `orange`) |

Only rows with `green` or `orange` in column B are used.

### Service Account Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select an existing one)
3. Enable the **Google Sheets API**
4. Go to **IAM & Admin → Service Accounts** and create a service account
5. Create a JSON key for the service account and download it
6. Copy the `client_email` to `GOOGLE_SERVICE_ACCOUNT_EMAIL`
7. Copy the `private_key` to `GOOGLE_PRIVATE_KEY` (keep `\n` line breaks)
8. Copy the spreadsheet ID from the sheet URL into `GOOGLE_SHEETS_ID`
9. Share the Google Sheet with the service account email (Viewer access is sufficient)

## Deploy to Render.com

1. Push this repository to GitHub
2. Log in to [Render](https://render.com) and click **New → Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add all environment variables from the table above in the Render dashboard
6. Deploy the service
7. Copy your Render URL (e.g. `https://shopify-seo-automation.onrender.com`)
8. Update your Shopify webhook URL to:
   `https://shopify-seo-automation.onrender.com/webhook/product-created`

> **Note:** Render free-tier services spin down after inactivity. The first webhook after idle may take 30–60 seconds to respond. Consider a paid plan for production use.

## Project Structure

```
src/
  index.js              — Express server entry point
  routes/
    webhook.js          — POST /webhook/product-created
  services/
    shopify.js          — Shopify API read/write
    sheets.js           — Google Sheets keyword fetcher
    claude.js           — Claude AI content generator
    processor.js        — Main orchestration logic
  utils/
    slugify.js          — Title to URL handle converter
    verify.js           — Shopify webhook HMAC verification
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the production server |
| `npm run dev` | Start with nodemon for local development |
