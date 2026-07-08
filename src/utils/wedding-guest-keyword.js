const DRESS_PRODUCT_PATTERN =
  /\b(dress|dresses|maxi|midi|mini dress|gown|sundress|jumpsuit|cocktail)\b/i;

const WEDDING_OCCASION_PATTERN =
  /\bwedding|garden gala|formal evening|cocktail part|evening occasion|formal event|bridesmaid|mother of the bride|dressed-up|formal wedding|wedding guest event/i;

const WEDDING_GUEST_KEYWORD_PATTERN = /wedding guest dress(?:es)?/i;

const WEDDING_GUEST_KEYWORD_RULE = `
WEDDING GUEST DRESS KEYWORD — CRITICAL (SEO):
- When a dress is suitable for weddings, garden galas, cocktail parties, formal evenings, or similar dressed-up occasions, you MUST include the exact phrase "wedding guest dress" or "wedding guest dresses" at least once in the title or description
- Use it naturally in the intro, a bullet, or closing — e.g. "formal wedding guest dress", "elegant wedding guest dresses", "perfect wedding guest dress for garden galas"
- Every time you reference wedding-related occasions (weddings, garden galas, formal evening events), use "wedding guest dress" / "wedding guest dresses" instead of generic wording like "formal event dress" alone
- Do NOT use this keyword for casual-only dresses (beach, everyday boho, gallery strolls) with no wedding or formal occasion context
- Prefer "wedding guest dresses" in titles when the keyword bank match fits; use singular "wedding guest dress" naturally in description copy
`.trim();

function isDressProduct(title = '', tags = '') {
  return DRESS_PRODUCT_PATTERN.test(`${title} ${tags}`);
}

function mentionsWeddingOccasion(text = '') {
  return WEDDING_OCCASION_PATTERN.test(text);
}

function hasWeddingGuestKeyword(text = '') {
  return WEDDING_GUEST_KEYWORD_PATTERN.test(text);
}

function requiresWeddingGuestKeyword(productTitle, tags, generatedTitle, description) {
  if (!isDressProduct(productTitle, tags)) {
    return false;
  }

  const combined = `${generatedTitle} ${description}`;
  return mentionsWeddingOccasion(combined);
}

function validateWeddingGuestKeyword(productTitle, tags, generatedTitle, description) {
  if (!requiresWeddingGuestKeyword(productTitle, tags, generatedTitle, description)) {
    return null;
  }

  const combined = `${generatedTitle} ${description}`;
  if (!hasWeddingGuestKeyword(combined)) {
    return 'must include "wedding guest dress" or "wedding guest dresses" when wedding-related occasions are mentioned';
  }

  return null;
}

module.exports = {
  WEDDING_GUEST_KEYWORD_RULE,
  isDressProduct,
  mentionsWeddingOccasion,
  hasWeddingGuestKeyword,
  requiresWeddingGuestKeyword,
  validateWeddingGuestKeyword,
};
