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

const GENERIC_LABELS = [
  /^silhouette:/im,
  /^length:/im,
  /^color:/im,
  /^occasion ready:/im,
  /^occasion:/im,
  /^style:/im,
  /^design:/im,
  /^fit:/im,
  /^versatility:/im,
];

const BANNED_PHRASES = [
  /air of drama/i,
  /endlessly versatile/i,
  /go-to choice/i,
  /stunning,? reliable/i,
  /effortlessly dressed-up/i,
  /wide range of body shapes/i,
  /pairs with virtually any/i,
];

function validateDescriptionContent(description) {
  const issues = [];

  if (!/SIZE CHART \(IN\)/i.test(description)) {
    issues.push('missing SIZE CHART (IN)');
  }

  if (/^WHY YOU'?LL LOVE IT/im.test(description.trim())) {
    issues.push('description must start with ALL CAPS headline, not WHY YOU\'LL LOVE IT');
  }

  if (!/^WHY YOU'?LL LOVE IT/im.test(description)) {
    issues.push('missing WHY YOU\'LL LOVE IT section');
  }

  for (const pattern of GENERIC_LABELS) {
    if (pattern.test(description)) {
      issues.push(`generic bullet label used: ${pattern.source}`);
    }
  }

  for (const pattern of BANNED_PHRASES) {
    if (pattern.test(description)) {
      issues.push(`banned AI phrase used: ${pattern.source}`);
    }
  }

  const introEnd = description.search(/WHY YOU'?LL LOVE IT/i);
  if (introEnd >= 0) {
    const headlineAndIntro = description.slice(0, introEnd).trim();
    const introLines = headlineAndIntro.split('\n').filter((l) => l.trim());
    if (introLines.length < 2) {
      issues.push('missing ALL CAPS headline and/or intro paragraph before bullets');
    }
  }

  return issues;
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

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      lastRawResponse = await callClaude(
        client,
        product,
        keywords,
        attempt > 0
      );
      const parsed = parseClaudeResponse(lastRawResponse);
      const issues = validateDescriptionContent(parsed.description);

      if (issues.length === 0) {
        return parsed;
      }

      console.warn(
        `Claude description quality issues for product ${product.id} (attempt ${attempt + 1}):`,
        issues.join('; ')
      );

      if (attempt === 1) {
        console.warn('Using best available response after quality retry');
        return parsed;
      }
    } catch (error) {
      if (attempt === 1) {
        console.error(
          `Claude failed twice for product ${product.id}. Raw output:`,
          lastRawResponse
        );
        throw error;
      }

      console.warn(
        `Claude request failed for product ${product.id}, retrying:`,
        error.message
      );
    }
  }
}

module.exports = { generateProductContent };
