const crypto = require('crypto');

const pendingStates = new Map();
const SCOPES =
  process.env.SHOPIFY_SCOPES || 'read_products,write_products';

function getShopDomain() {
  let storeUrl = process.env.SHOPIFY_STORE_URL;
  if (!storeUrl) throw new Error('SHOPIFY_STORE_URL must be configured');
  if (!storeUrl.startsWith('http')) storeUrl = `https://${storeUrl}`;
  return storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function getRedirectUri(req) {
  if (process.env.SHOPIFY_OAUTH_REDIRECT_URI) {
    return process.env.SHOPIFY_OAUTH_REDIRECT_URI;
  }

  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  return `${protocol}://${host}/auth/callback`;
}

function installHandler(req, res) {
  try {
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    if (!clientId) {
      return res.status(500).send('SHOPIFY_CLIENT_ID is not configured');
    }

    const state = crypto.randomBytes(16).toString('hex');
    pendingStates.set(state, Date.now());

    const redirectUri = getRedirectUri(req);
    const shop = getShopDomain();

    const url = new URL(`https://${shop}/admin/oauth/authorize`);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('scope', SCOPES);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);

    console.log(`OAuth install started — redirect URI: ${redirectUri}`);
    res.redirect(url.toString());
  } catch (error) {
    console.error('OAuth install error:', error.message);
    res.status(500).send(error.message);
  }
}

async function callbackHandler(req, res) {
  const { code, state, shop, error } = req.query;

  if (error) {
    return res.status(400).send(`Shopify OAuth error: ${error}`);
  }

  if (!code || !state) {
    return res.status(400).send('Missing code or state from Shopify');
  }

  if (!pendingStates.has(state)) {
    return res.status(400).send('Invalid or expired OAuth state — try /auth/install again');
  }

  pendingStates.delete(state);

  try {
    const shopDomain = shop || getShopDomain();
    const response = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Token exchange failed (${response.status}): ${text}`);
    }

    const data = JSON.parse(text);

    console.log('OAuth success — permanent access token received');
    console.log('Add this to your .env file:');
    console.log(`SHOPIFY_ACCESS_TOKEN=${data.access_token}`);

    res.send(`<!DOCTYPE html>
<html><body style="font-family:sans-serif;max-width:640px;margin:40px auto;padding:20px">
  <h1>Shopify connected</h1>
  <p>Copy this line into your <code>.env</code> file, then restart the server:</p>
  <pre style="background:#f4f4f4;padding:16px;overflow-x:auto">SHOPIFY_ACCESS_TOKEN=${data.access_token}</pre>
  <p>Scopes: ${data.scope || SCOPES}</p>
  <p>Then run: <code>npm run register-webhook -- YOUR_NGROK_URL/webhook/product-created</code></p>
</body></html>`);
  } catch (err) {
    console.error('OAuth callback error:', err.message);
    res.status(500).send(err.message);
  }
}

module.exports = { installHandler, callbackHandler };
