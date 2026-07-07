const MAX_IMAGES = Number(process.env.MAX_PRODUCT_IMAGES) || 4;

function getProductImageUrls(product) {
  if (!product?.images?.length) {
    return [];
  }

  const seen = new Set();
  const urls = [];

  for (const image of product.images) {
    const url = image.src || image.url;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
    if (urls.length >= MAX_IMAGES) break;
  }

  return urls;
}

function buildVisionImageBlocks(product) {
  return getProductImageUrls(product).map((url) => ({
    type: 'image',
    source: {
      type: 'url',
      url,
    },
  }));
}

function formatVisionContext(product) {
  const urls = getProductImageUrls(product);

  if (urls.length === 0) {
    return 'Product images: none available — infer design details from title, tags, and supplier description only.';
  }

  return [
    `Product images: ${urls.length} attached — use them to identify silhouette, neckline, sleeves, hem, heel, straps, print/pattern, embellishments, and how many distinct colors are visible.`,
    'Color title rule: if only one color is visible across images, include that color in the title; if multiple colors are visible, do not include color in the title.',
    'Never name fabric or material — describe construction and design only.',
  ].join('\n');
}

module.exports = {
  MAX_IMAGES,
  getProductImageUrls,
  buildVisionImageBlocks,
  formatVisionContext,
};
