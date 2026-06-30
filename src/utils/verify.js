const crypto = require('crypto');

function getWebhookSecrets() {
  const secrets = new Set();

  for (const value of [
    process.env.SHOPIFY_WEBHOOK_SECRET,
    process.env.SHOPIFY_CLIENT_SECRET,
  ]) {
    if (!value) continue;

    secrets.add(value.trim());

    if (value.startsWith('shpss_')) {
      secrets.add(value.slice(6).trim());
    }
  }

  return [...secrets];
}

function hmacMatches(rawBody, secret, hmacHeader) {
  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'base64'),
      Buffer.from(hmacHeader, 'base64')
    );
  } catch {
    return false;
  }
}

function verifyShopifyWebhook(req) {
  const secrets = getWebhookSecrets();

  if (secrets.length === 0) {
    console.error(
      'Webhook auth failed: set SHOPIFY_WEBHOOK_SECRET or SHOPIFY_CLIENT_SECRET'
    );
    return false;
  }

  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  if (!hmacHeader) {
    console.error('Webhook auth failed: missing X-Shopify-Hmac-Sha256 header');
    return false;
  }

  const rawBody = req.body;
  if (!rawBody || !Buffer.isBuffer(rawBody)) {
    console.error(
      'Webhook auth failed: request body is not raw (got %s). Check express.raw() middleware.',
      typeof rawBody
    );
    return false;
  }

  for (const secret of secrets) {
    if (hmacMatches(rawBody, secret, hmacHeader)) {
      return true;
    }
  }

  console.error(
    'Webhook auth failed: HMAC mismatch (body %d bytes). ' +
      'Delete the webhook in Settings → Notifications and re-register it via Dev Dashboard → your app → Webhooks, ' +
      'or run: node scripts/register-webhook.js YOUR_NGROK_URL/webhook/product-created',
    rawBody.length
  );

  return false;
}

module.exports = { verifyShopifyWebhook };
