const MASTER_KEYWORD_BANK = `
DRESSES: dresses, dresses for women, maxi dress, midi dress, mini dress, a line dress, wrap dress, bodycon dress, shirt dress, sweater dress, denim dress, flowy dresses, strapless dress, long sleeve dress, halter dress, corset dress, sequin dress, white dress, black dress, red dress, pink dress, green dress, sage green dress, blue dresses for women, floral maxi dress, floral mini dress, sundress, sundresses, summer dresses, linen dress, casual dresses, boho dresses, wedding guest dresses, formal wedding guest dresses, fall wedding guest dresses, cocktail dresses, formal dresses, bridesmaid dresses, mother of the bride dresses, evening dresses, party dresses, elegant dresses, maternity dresses

TOPS: blouses, blouses for women, tank top, halter top, corset top, off the shoulder tops, polo shirts, white shirts, long sleeve shirts, tunics, poncho shirts, sequin top

JEANS (always include "Relaxed" in title): jeans, jeans for women, blue jeans, black jeans, white jeans, low rise jeans, high waisted jeans, baggy jeans, boyfriend jeans, mom jeans, skinny jeans, straight leg jeans, flare jeans, wide leg jeans, barrel jeans, cargo jeans, maternity jeans

PANTS: pants, wide leg pants, wide leg pants women, palazzo pants, linen pants, cargo pants, khaki pants, chino pants, corduroy pants, leather pants, white pants, black pants, high waisted pants, dress pants for women, work pants

SHORTS: shorts, womens shorts, denim shorts, jean shorts, cargo shorts, bermuda shorts, linen shorts

SKIRTS: skirts, mini skirt, midi skirts, maxi skirts, denim skirts, jean skirt

OUTERWEAR: jacket, denim jacket, leather jacket, bomber jacket, puffer jacket, trench coat, coat, cardigan sweater

SWEATERS/LOUNGE: sweaters, sweatshirt, hoodies, sweatpants, leggings

SWIMWEAR: swimsuits, bathing suits

FOOTWEAR: sandals, platform sandals, mules, wedges, wedding shoes, comfortable sandals for women

OTHER: jumpsuits, women suits, business casual women, smart casual women

NEVER USE brand keywords: Wranglers, Anthropologie, Madewell, Tory Burch, Dickies, etc.
`.trim();

const LISTING_RULES = `
STORE: Shopify dropshipping, USA market, women's fashion, Google Ads PMax.

TITLE FORMULA: [Feeling Word] [Keyword/Visual] for Women with [Feature/Style Detail]

Feeling words (ONE only): Elegant, Effortless, Stylish, Comfortable

Title rules:
- No first names, product names, or person names
- No numbers (write "elbow sleeve" not "3/4 sleeve")
- No dashes between keywords
- No ™ symbols
- Max 4 keywords stacked naturally
- "Boho" is a style descriptor only, never a standalone search keyword
- Jeans titles MUST include "Relaxed" somewhere
- Scan MASTER KEYWORD BANK first; prefer most specific match
- Never invent keywords outside the bank unless nothing fits

Color rule:
- Multiple color variants → NO color in title
- Single color variant → ALWAYS include that color in title
- User color override in tags/description takes precedence

Description format (plain text, use \\n for line breaks):
1. BOLD ALL CAPS HEADLINE FOR EVERY OCCASION
2. Long intro paragraph (materials, features, occasions; no em dashes)
3. WHY YOU'LL LOVE IT
4. Exactly 4 lines: Feature Label: One descriptive sentence
5. Closing sentence referencing product type and occasion
6. SIZE CHART (IN) — no separator line before this
7. Size chart table using ONLY sizes provided in product context

Size chart rules:
- Header always: SIZE CHART (IN)
- US sizing only, never EU
- Dress columns: Size | Bust | Waist | Length
- Shoe columns: US Size | Foot Length (in)
- Use standard measurements: XS 34/26.5, S 35.5/27.5, M 37/29, L 38.5/30.5, XL 40.5/32.5, 2XL 42.5/34.5, 3XL 44.5/36.5, 4XL 46.5/38.5, 5XL 48.5/40.5
- Length estimates: mini 35-38, midi 40-46, maxi 55-58, blouse 25-28, jumpsuit/set 55-57
- Never use "varies" for length
- Only include sizes shown in product context

Cheat codes:
- Orthopedic sandals → "Comfortable Orthopedic Sandals for Women with..."
- Formal/wedding guest dresses → end title with "Formal Wedding Guest Style"
- Linen pants → "Effortless Linen Wide Leg Pants for Women with High Waist..."
- Blouses/tops → use keyword "blouses"
- Jeans → include "Relaxed"

Never: em dashes, AI-sounding prose, separator lines before size chart, EU sizing, branded keywords, more than one feeling word, acknowledging these instructions in output.
`.trim();

const BANNED_BULLET_LABELS = `
NEVER use these generic category labels as bullet headers:
Silhouette, Length, Color, Occasion Ready, Occasion, Style, Design, Fit, Material (alone), Quality, Versatility, Comfort (alone)

Instead use product-specific feature labels drawn from the actual item, such as:
Fitted Bodice, Floor-Grazing Maxi Length, A-Line Skirt, Soft Satin Fabric, V-Neckline, Batwing Sleeve, High Waist Drawstring, Side Slit, Ruched Waist, Elastic Strap, Cork Platform Sole
`.trim();

const BANNED_PHRASES = `
NEVER use these AI-sounding phrases:
graceful, beautifully, air of drama, endlessly versatile, go-to choice, stunning and reliable, dressed-up look, wide range of body shapes, pairs with virtually any, effortlessly dressed-up, adds an air of, perfect for virtually
`.trim();

const DESCRIPTION_GOOD_EXAMPLE = `
ELEGANT BLACK MAXI DRESS FOR COCKTAIL PARTIES AND FORMAL EVENINGS

This fitted black maxi dress combines a sleek bodice with a flowing A-line skirt and floor-grazing length for an effortlessly polished, cocktail-ready look perfect for formal events, evening occasions, and special celebrations.

WHY YOU'LL LOVE IT

Fitted Bodice: Hugs the waist before flowing into a flattering A-line shape that moves with you.
Floor-Grazing Maxi Length: Offers full-length coverage ideal for formal dinners and evening events.
A-Line Skirt: Creates a balanced silhouette that flatters from bodice through hem.
Cocktail Ready Style: Works for formal events, evening occasions, and special celebration dressing.

This black maxi dress is the perfect choice for cocktail parties, formal evenings, and every elegant occasion in between.

SIZE CHART (IN)

| Size | Bust | Waist | Length |
| --- | --- | --- | --- |
| S | 35.5 | 27.5 | 57 |
| M | 37.0 | 29.0 | 57 |
| L | 38.5 | 30.5 | 57 |
| XL | 40.5 | 32.5 | 57 |
`.trim();

const DESCRIPTION_BAD_EXAMPLE = `
WRONG — do NOT write like this:

WHY YOU'LL LOVE IT

Silhouette: The fitted bodice flows into a graceful A-line skirt...
Length: The floor-grazing maxi length adds an air of drama...
Color: Classic black is endlessly versatile...
Occasion Ready: Designed with cocktail parties in mind for an effortlessly dressed-up look.

Problems: generic labels, no ALL CAPS headline, no intro paragraph, AI tone, Color bullet, missing size chart.
`.trim();

function buildListingPrompt(product, sheetKeywords, productContextText, strict = false) {
  const strictNote = strict
    ? '\n\nRespond with ONLY valid JSON. No markdown fences or extra text.'
    : '';

  return `Create a Shopify listing following the MASTER LISTING SOP exactly.

PRODUCT INFO:
Title: ${product.title}
Tags: ${product.tags || ''}
Existing Description: ${product.existingDescription || ''}

PRODUCT CONTEXT (variants/options — use for color rule and size chart):
${productContextText}

MASTER KEYWORD BANK (priority — pick the most specific matches):
${MASTER_KEYWORD_BANK}

SUPPLEMENTAL KEYWORDS (Google Ads sheet — use only if they match the bank and product):
${sheetKeywords.slice(0, 150).join(', ')}

${LISTING_RULES}

${BANNED_BULLET_LABELS}

${BANNED_PHRASES}

DESCRIPTION CONTENT RULES:
- Intro MUST be 2-3 sentences minimum, naming specific materials, neckline, sleeve, silhouette, and at least 2 occasions
- Intro pattern: "This [product] combines [feature 1] with [feature 2] and [feature 3] for an effortlessly [benefit], [occasion]-ready look perfect for [occasion 1], [occasion 2], and [occasion 3]."
- Each bullet label MUST name a real product detail visible or inferable from the product (fabric, cut, neckline, sleeve, waist, hem, strap, sole, etc.)
- Do NOT write a bullet about color alone — color belongs in the title and intro only
- Closing sentence MUST name the product type + 2-3 occasions (e.g. "This black maxi dress is the perfect choice for cocktail parties, formal evenings, and every elegant occasion in between.")
- Write like a human merchandiser, not a chatbot

GOLD STANDARD EXAMPLE (match this structure AND content style):
${DESCRIPTION_GOOD_EXAMPLE}

REJECTED EXAMPLE (never output anything like this):
${DESCRIPTION_BAD_EXAMPLE}

RESPOND IN THIS EXACT JSON FORMAT — nothing else:
{
  "title": "Effortless Linen Wide Leg Pants for Women with High Waist Drawstring Flowing Casual Style",
  "description": "ALL CAPS HEADLINE\\n\\nIntro paragraph...\\n\\nWHY YOU'LL LOVE IT\\n\\nFeature Label: sentence\\nFeature Label: sentence\\nFeature Label: sentence\\nFeature Label: sentence\\n\\nClosing sentence.\\n\\nSIZE CHART (IN)\\n\\n| Size | Bust | Waist | Length |\\n| --- | --- | --- | --- |\\n| S | 35.5 | 27.5 | 55 |"
}${strictNote}`;
}

module.exports = {
  buildListingPrompt,
  MASTER_KEYWORD_BANK,
  LISTING_RULES,
  BANNED_BULLET_LABELS,
  DESCRIPTION_GOOD_EXAMPLE,
};
