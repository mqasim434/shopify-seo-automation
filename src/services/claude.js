const Anthropic = require('@anthropic-ai/sdk');
const { buildListingPrompt } = require('../prompts/listing-sop');
const { formatProductContext, getProductContext } = require('../utils/product-context');

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are a senior listing copywriter for a USA women's fashion Shopify dropshipping store running Google Ads PMax. You follow the Master Listing SOP exactly on every product. Output only valid JSON with "title" and "description" fields. Never add commentary outside the JSON.`;

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseClaudeResponse(text) {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('No JSON object found in Claude response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  if (!parsed.title || !parsed.description) {
    throw new Error('Claude response missing title or description fields');
  }

  return {
    title: parsed.title.trim(),
    description: parsed.description,
  };
}

async function callClaude(client, product, keywords, strict = false) {
  const productContext = getProductContext(product);
  const promptProduct = {
    title: product.title,
    tags: product.tags,
    existingDescription: stripHtml(product.body_html),
  };

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildListingPrompt(
          promptProduct,
          keywords,
          formatProductContext(productContext),
          strict
        ),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock) {
    throw new Error('Claude returned no text content');
  }

  return textBlock.text;
}

async function generateProductContent(product, keywords) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY must be configured');
  }

  const client = new Anthropic({ apiKey });
  let lastRawResponse = '';

  try {
    lastRawResponse = await callClaude(client, product, keywords, false);
    return parseClaudeResponse(lastRawResponse);
  } catch (firstError) {
    console.warn(
      `Claude JSON parse failed for product ${product.id}, retrying:`,
      firstError.message
    );

    try {
      lastRawResponse = await callClaude(client, product, keywords, true);
      return parseClaudeResponse(lastRawResponse);
    } catch (secondError) {
      console.error(
        `Claude returned malformed JSON twice for product ${product.id}. Raw output:`,
        lastRawResponse
      );
      throw new Error(
        `Failed to parse Claude response after retry: ${secondError.message}`
      );
    }
  }
}

module.exports = { generateProductContent };
