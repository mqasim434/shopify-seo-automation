const { getKeywords } = require('./sheets');
const { generateProductContent } = require('./claude');
const { updateProduct, getProduct } = require('./shopify');
const { slugify } = require('../utils/slugify');
const { descriptionToHtml } = require('../utils/description-html');

async function processProduct(webhookProduct) {
  const productId = webhookProduct.id;

  try {
    const keywords = await getKeywords();

    if (keywords.length === 0) {
      throw new Error('No keywords available from Google Sheets');
    }

    const product = await getProduct(productId);
    const content = await generateProductContent(product, keywords);
    const oldTitle = product.title || webhookProduct.title;

    const payload = {
      title: content.title,
      body_html: descriptionToHtml(content.description),
      handle: slugify(content.title),
      status: 'draft',
    };

    await updateProduct(productId, payload);

    console.log(
      `Successfully processed product ${productId}: "${oldTitle}" → "${content.title}"`
    );
  } catch (error) {
    console.error(`Error processing product ${productId}:`, error);
  }
}

module.exports = { processProduct };
