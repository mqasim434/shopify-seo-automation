/**
 * Register products/create webhook via Admin API (tied to your Dev Dashboard app).
 * Usage: node scripts/register-webhook.js https://YOUR-NGROK.ngrok-free.app/webhook/product-created
 */
require('dotenv').config();

const { getAccessToken, getStoreUrl } = require('../src/services/shopify');

const webhookUrl = process.argv[2];

if (!webhookUrl) {
  console.error(
    'Usage: node scripts/register-webhook.js https://YOUR-NGROK.ngrok-free.app/webhook/product-created'
  );
  process.exit(1);
}

async function shopifyRequest(accessToken, method, path, body) {
  const response = await fetch(
    `${getStoreUrl()}/admin/api/2024-01${path}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Shopify API ${method} ${path} (${response.status}): ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

async function main() {
  console.log('Fetching access token...');
  const accessToken = await getAccessToken();

  console.log('Listing existing webhooks...');
  const { webhooks } = await shopifyRequest(accessToken, 'GET', '/webhooks.json');

  const existing = webhooks.filter(
    (w) => w.topic === 'products/create' && w.address === webhookUrl
  );

  if (existing.length > 0) {
    console.log(`Webhook already registered: ${webhookUrl}`);
    console.log('Delete any duplicate webhooks in Settings → Notifications if HMAC still fails.');
    return;
  }

  const duplicates = webhooks.filter((w) => w.topic === 'products/create');
  for (const webhook of duplicates) {
    console.log(`Removing old products/create webhook: ${webhook.address}`);
    await shopifyRequest(accessToken, 'DELETE', `/webhooks/${webhook.id}.json`);
  }

  console.log(`Registering webhook: ${webhookUrl}`);
  const { webhook } = await shopifyRequest(accessToken, 'POST', '/webhooks.json', {
    webhook: {
      topic: 'products/create',
      address: webhookUrl,
      format: 'json',
    },
  });

  console.log('Webhook registered successfully (ID: %s)', webhook.id);
  console.log('');
  console.log('Also delete any manual webhook in Settings → Notifications → Webhooks');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
