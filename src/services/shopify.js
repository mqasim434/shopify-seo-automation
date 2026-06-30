const STANDARD_SIZES = ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20'];

let cachedToken = null;
let tokenExpiresAt = 0;

function getStoreUrl() {
  let storeUrl = process.env.SHOPIFY_STORE_URL;

  if (!storeUrl) {
    throw new Error('SHOPIFY_STORE_URL must be configured');
  }

  if (!storeUrl.startsWith('http')) {
    storeUrl = `https://${storeUrl}`;
  }

  return storeUrl.replace(/\/$/, '');
}

async function getAccessToken() {
  if (process.env.SHOPIFY_ACCESS_TOKEN) {
    return process.env.SHOPIFY_ACCESS_TOKEN;
  }

  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Set SHOPIFY_ACCESS_TOKEN (production stores) or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET (dev stores only)'
    );
  }

  const response = await fetch(`${getStoreUrl()}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const errorText = await response.text();

  if (!response.ok) {
    if (errorText.includes('shop_not_permitted')) {
      throw new Error(
        'shop_not_permitted: Client credentials do not work on production stores. ' +
          'Visit /auth/install once to get a permanent SHOPIFY_ACCESS_TOKEN. ' +
          'See README for setup steps.'
      );
    }

    throw new Error(
      `Failed to fetch Shopify access token (${response.status}): ${errorText}`
    );
  }

  const data = JSON.parse(errorText);
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 86399) * 1000;

  console.log('Shopify access token refreshed (client credentials)');

  return cachedToken;
}

async function shopifyRequest(method, path, body) {
  const baseUrl = `${getStoreUrl()}/admin/api/2024-01`;
  const accessToken = await getAccessToken();

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

async function getProduct(productId) {
  try {
    const data = await shopifyRequest('GET', `/products/${productId}.json`);
    const product = data.product;

    return {
      id: product.id,
      title: product.title,
      body_html: product.body_html,
      tags: product.tags,
      images: product.images,
      variants: product.variants,
      options: product.options,
      handle: product.handle,
    };
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    throw error;
  }
}

function findSizeOptionIndex(product) {
  if (!product.options || product.options.length === 0) {
    return 0;
  }

  const sizeOptionIndex = product.options.findIndex(
    (option) => option.name && option.name.toLowerCase() === 'size'
  );

  return sizeOptionIndex >= 0 ? sizeOptionIndex : 0;
}

function getVariantSize(variant, optionIndex) {
  const optionKey = `option${optionIndex + 1}`;
  return variant[optionKey] || variant.option1 || '';
}

function buildVariants(existingVariants, optionIndex) {
  const firstVariant = existingVariants[0] || { price: '0.00' };
  const optionKey = `option${optionIndex + 1}`;
  const variants = [];

  for (const size of STANDARD_SIZES) {
    const existing = existingVariants.find(
      (variant) => getVariantSize(variant, optionIndex) === size
    );

    if (existing) {
      variants.push({
        id: existing.id,
        [optionKey]: size,
        price: existing.price,
        sku: existing.sku,
        compare_at_price: existing.compare_at_price,
        inventory_management: existing.inventory_management,
        inventory_policy: existing.inventory_policy,
        fulfillment_service: existing.fulfillment_service,
        requires_shipping: existing.requires_shipping,
        taxable: existing.taxable,
        weight: existing.weight,
        weight_unit: existing.weight_unit,
      });
    } else {
      variants.push({
        [optionKey]: size,
        price: firstVariant.price,
        sku: firstVariant.sku,
        compare_at_price: firstVariant.compare_at_price,
        inventory_management: firstVariant.inventory_management,
        inventory_policy: firstVariant.inventory_policy,
        fulfillment_service: firstVariant.fulfillment_service,
        requires_shipping: firstVariant.requires_shipping,
        taxable: firstVariant.taxable,
        weight: firstVariant.weight,
        weight_unit: firstVariant.weight_unit,
      });
    }
  }

  return variants;
}

async function updateProduct(productId, payload) {
  try {
    const productPayload = {
      product: {
        id: productId,
        title: payload.title,
        body_html: payload.body_html,
        handle: payload.handle,
        status: 'draft',
      },
    };

    const data = await shopifyRequest(
      'PUT',
      `/products/${productId}.json`,
      productPayload
    );

    return data.product;
  } catch (error) {
    console.error(`Failed to update product ${productId}:`, error);
    throw error;
  }
}

module.exports = {
  getProduct,
  updateProduct,
  getAccessToken,
  getStoreUrl,
  STANDARD_SIZES,
};
