const Anthropic = require('@anthropic-ai/sdk');
const { buildListingPrompt } = require('../prompts/listing-sop');
const { formatProductContext, getProductContext } = require('../utils/product-context');

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are a senior listing copywriter for a USA women's fashion Shopify dropshipping store. You write exactly like the client's approved listing samples: ALL CAPS headline, two-sentence intro with styling/pairing detail, compound feature bullet labels, specific construction details, and NEVER mention polyester, poly, or synthetic fabric names. Output only valid JSON with "title" and "description" fields.`;

const POLYESTER_PATTERN =
  /polyester|poly[- ]blend|poly-blend|polycotton|poly cotton|synthetic fabric|synthetic material|man-made fiber|\bpoly\b/i;

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function sanitizeSupplierDescription(text) {
  if (!text) return '';

  const withoutPolySentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !POLYESTER_PATTERN.test(sentence))
    .join(' ')
    .trim();

  return withoutPolySentences
    .replace(/\b\d+%?\s*(polyester|poly|spandex|elastane)\b/gi, '')
    .replace(/\b(polyester|poly[- ]blend|poly-blend|polycotton|poly cotton)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
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
  /^silhouette:\s/i,
  /^length:\s/i,
  /^color:\s/i,
  /^occasion ready:\s/i,
  /^occasion:\s/i,
  /^style:\s/i,
  /^design:\s/i,
  /^fit:\s/i,
  /^material:\s/i,
  /^quality:\s/i,
  /^comfort:\s/i,
];

const BANNED_PHRASES = [
  /polyester/i,
  /\bpoly\b/i,
  /poly blend/i,
  /poly-blend/i,
  /polycotton/i,
  /poly cotton/i,
  /synthetic fabric/i,
  /synthetic material/i,
  /man-made fiber/i,
  /air of drama/i,
  /endlessly versatile/i,
  /go-to choice/i,
  /stunning,? reliable/i,
  /effortlessly dressed-up/i,
  /wide range of body shapes/i,
  /pairs with virtually any/i,
];

function countIntroSentences(description) {
  const introEnd = description.search(/WHY YOU'?LL LOVE IT/i);
  if (introEnd < 0) return 0;

  const headlineAndIntro = description.slice(0, introEnd).trim();
  const lines = headlineAndIntro.split('\n').map((line) => line.trim()).filter(Boolean);
  const introText = lines.slice(1).join(' ');

  return introText.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.trim()).length;
}

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

  if (!/are the perfect choice for/i.test(description)) {
    issues.push('missing closing sentence pattern');
  }

  for (const pattern of GENERIC_LABELS) {
    if (pattern.test(description)) {
      issues.push(`generic bullet label used: ${pattern.source}`);
    }
  }

  for (const pattern of BANNED_PHRASES) {
    if (pattern.test(description)) {
      issues.push(`banned phrase or material used: ${pattern.source}`);
    }
  }

  const introEnd = description.search(/WHY YOU'?LL LOVE IT/i);
  if (introEnd >= 0) {
    const headlineAndIntro = description.slice(0, introEnd).trim();
    const lines = headlineAndIntro.split('\n').filter((l) => l.trim());
    if (lines.length < 2) {
      issues.push('missing ALL CAPS headline and/or intro paragraph before bullets');
    }

    if (countIntroSentences(description) < 1) {
      issues.push('intro must contain at least 1 sentence');
    }
  }

  const bulletSection = description.match(
    /WHY YOU'?LL LOVE IT([\s\S]*?)(?:These |This |SIZE CHART)/i
  );
  if (bulletSection) {
    const bullets = bulletSection[1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.includes(':'));

    if (bullets.length < 4) {
      issues.push('must include exactly 4 feature bullets');
    }

    for (const bullet of bullets) {
      if (bullet.length < 60) {
        issues.push('feature bullets must be full descriptive sentences');
        break;
      }
    }
  }

  return issues;
}

async function callClaude(client, product, keywords, strict = false, retryIssues = []) {
  const productContext = getProductContext(product);
  const rawDescription = stripHtml(product.body_html);
  const promptProduct = {
    title: product.title,
    tags: product.tags,
    existingDescription: sanitizeSupplierDescription(rawDescription),
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
          strict,
          retryIssues
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
  let lastIssues = [];

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      lastRawResponse = await callClaude(
        client,
        product,
        keywords,
        attempt > 0,
        lastIssues
      );
      const parsed = parseClaudeResponse(lastRawResponse);
      const issues = validateDescriptionContent(parsed.description);
      lastIssues = issues;

      if (issues.length === 0) {
        return parsed;
      }

      console.warn(
        `Claude description quality issues for product ${product.id} (attempt ${attempt + 1}):`,
        issues.join('; ')
      );

      if (attempt === 3) {
        console.warn('Using best available response after quality retries');
        return parsed;
      }
    } catch (error) {
      if (attempt === 3) {
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
