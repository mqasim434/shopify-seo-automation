const Anthropic = require('@anthropic-ai/sdk');

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are an expert SEO copywriter for a women's fashion e-commerce store. You write product titles and descriptions that rank well on Google Shopping and convert browsers into buyers. You always follow the exact output format provided. Never add commentary, headers, or extra text outside the format.`;

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildUserPrompt(product, keywords, strict = false) {
  const keywordList = keywords.join(', ');
  const strictNote = strict
    ? '\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown code fences, no explanation, no extra text.'
    : '';

  return `Here is a Shopify product that needs an SEO-optimized title and description.

PRODUCT INFO:
Title: ${product.title}
Tags: ${product.tags || ''}
Existing Description: ${stripHtml(product.body_html)}

AVAILABLE KEYWORDS (high-value, from Google Ads Keyword Planner):
${keywordList}

YOUR TASK:

1. ANALYZE the product — identify its color, length, neckline, sleeve style, silhouette, and occasion type based on the title, tags, and description.

2. SELECT 3 to 4 keywords from the list above that best match this product. Prioritize specificity and search volume relevance.

3. WRITE a new product title by combining those 3-4 keywords naturally. The title should be 60-80 characters. No brand name. No punctuation between keywords except spaces. Example format:
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
  "title": "the new SEO title here",
  "description": "the full description here with \\n for line breaks"
}${strictNote}`;
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
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(product, keywords, strict),
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
      `Claude JSON parse failed for product ${product.id}, retrying with stricter prompt:`,
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
