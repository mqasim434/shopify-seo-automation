const { getKeywords } = require('./sheets');
const { generateProductContent } = require('./claude');
const { updateProduct } = require('./shopify');
const { slugify } = require('../utils/slugify');

function descriptionToHtml(description) {
  const paragraphs = description.split(/\n\n+/);

  return paragraphs
    .map((paragraph) => {
      const lines = paragraph.split('\n').join('<br>');
      return `<p>${lines}</p>`;
    })
    .join('');
}

async function processProduct(product) {
  const productId = product.id;

  try {
    const keywords = await getKeywords();

    if (keywords.length === 0) {
      throw new Error('No keywords available from Google Sheets');
    }

    const content = await generateProductContent(product, keywords);
    const oldTitle = product.title;

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
