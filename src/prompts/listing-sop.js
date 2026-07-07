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

MATERIAL RULE — CRITICAL:
- NEVER mention polyester, poly, poly-blend, or synthetic fabric names in the description
- If fabric is unknown, describe the visual/texture instead: woven upper, soft fabric, textured finish, lightweight feel
- Prefer premium descriptors when inferring: leather, linen, satin, crochet, jute, cork, suede, cotton, knit
- Do NOT copy fabric claims from the supplier description if they mention polyester

Description format (plain text, use \\n for line breaks):
1. ALL CAPS headline — product-specific positioning line (NOT a generic "FOR EVERY OCCASION" filler)
2. Intro — ONE sentence minimum (two when styling/pairing detail adds value)
3. WHY YOU'LL LOVE IT
4. Exactly 4 lines: Compound Feature Label: One full descriptive sentence (40+ words total per bullet is ideal)
5. Closing sentence (exact pattern below)
6. SIZE CHART (IN) — flows directly after closing, no separator line
7. Size chart table using ONLY sizes from product context

Intro rules (CRITICAL — match client samples):
- Sentence 1 (required): "These/This [product type] combine(s) [feature 1] with [feature 2] and [feature 3] for an effortlessly [benefit], [occasion]-ready look perfect for [occasion 1], [occasion 2], and [occasion 3]."
- Sentence 2 (recommended when it fits): Add a practical or styling detail — how it wears, what it pairs with (wide-leg pants, midi skirts, sundresses, tailored trousers), or why it is easy to wear
- Name real construction details: woven upper, block heel, ankle strap, closed-toe, slingback, crochet upper, cork sole, etc.

Bullet rules (CRITICAL — match client samples):
- Use compound labels: Woven Leather Upper, Closed-Toe Silhouette, Embellished Block Heel, Adjustable Buckle Ankle Strap, Braided Jute Flatform Sole
- Each bullet = label + colon + ONE full sentence with specific detail AND a clear benefit
- Bullets should feel merchandised, not templated
- NEVER use standalone generic labels: Silhouette, Length, Color, Occasion Ready, Style, Design, Fit, Material, Quality

Closing sentence pattern (use exactly this structure):
"These [product type plural/name] are the perfect choice for [occasion 1], [occasion 2], and every [adjective] occasion in between."

Size chart rules:
- Header always: SIZE CHART (IN)
- US sizing only, never EU
- Dress columns: Size | Bust | Waist | Length
- Shoe/sandal columns: US Size | Foot Length (in) — use 2 decimal places
- Standard shoe chart when sizes unknown: US 4=8.7, 4.5=8.9, 5=8.9, 5.5=9.3, 6=9.3, 6.5=9.4, 7=9.4, 7.5=9.8, 8=9.8, 8.5=10.0, 9=10.0, 9.5=10.2, 10=10.2, 10.5=10.6, 11=10.6, 11.5=10.8, 12=10.8
- Dress measurements: XS 34/26.5, S 35.5/27.5, M 37/29, L 38.5/30.5, XL 40.5/32.5, 2XL 42.5/34.5, 3XL 44.5/36.5
- Length estimates: mini 35-38, midi 40-46, maxi 55-58, blouse 25-28
- Only include sizes shown in product context

Cheat codes:
- Sandals → start description headline with "COMFORTABLE..." when appropriate; use Comfortable in title
- Orthopedic sandals → "Comfortable Orthopedic Sandals for Women with..."
- Formal/wedding guest dresses → end title with "Formal Wedding Guest Style"
- Linen pants → "Effortless Linen Wide Leg Pants for Women with High Waist..."
- Blouses/tops → use keyword "blouses"
- Jeans → include "Relaxed"

Never: polyester, em dashes, AI-sounding prose, separator lines before size chart, EU sizing, branded keywords, more than one feeling word, acknowledging these instructions in output.
`.trim();

const BANNED_MATERIALS = `
NEVER mention in the description:
polyester, poly blend, poly-blend, polycotton, synthetic fabric, synthetic material, man-made fiber, acrylic, nylon (unless clearly athletic wear)
`.trim();

const BANNED_BULLET_LABELS = `
NEVER use these standalone generic labels:
Silhouette:, Length:, Color:, Occasion Ready:, Occasion:, Style:, Design:, Fit:, Material:, Quality:, Comfort:

ALLOWED when part of a compound label:
Closed-Toe Silhouette, Pointed-Toe Silhouette, Flat Sole Construction, Woven Leather Upper
`.trim();

const BANNED_PHRASES = `
NEVER use: graceful, beautifully, air of drama, endlessly versatile, go-to choice, stunning and reliable, dressed-up look, wide range of body shapes, pairs with virtually any, effortlessly dressed-up, adds an air of, perfect for virtually, premium polyester, soft polyester
`.trim();

const CLIENT_SANDAL_EXAMPLES = [
  `
COMFORTABLE WOVEN CLOSED-TOE SLIP-ON SANDALS FOR WOMEN WHO WANT EFFORTLESS EVERYDAY STYLE

These comfortable sandals for women combine an intricately woven upper with a closed-toe silhouette and a flat sole for an effortlessly polished, all-day look perfect for casual office wear, weekend brunches, and city strolls. The slip-on design requires no buckles or straps, making these flats a practical and refined choice that pairs naturally with wide-leg pants, midi skirts, sundresses, and tailored trousers.

WHY YOU'LL LOVE IT

Woven Leather Upper: Detailed weaving across the toe box adds texture and a refined finish that elevates any everyday outfit.

Closed-Toe Silhouette: Offers a more polished look than open-toe styles with gentle coverage that works for both casual and smart-casual occasions.

Slip-On Flat Entry: No buckles or straps means you slide them on instantly, keeping your morning routine quick and completely fuss-free.

Flat Low-Profile Sole: Keeps your stride steady and your posture natural through long days of walking, errands, and social outings.

These comfortable sandals are the perfect choice for casual office days, weekend outings, and every smart-casual occasion in between.

SIZE CHART (IN)

| US Size | Foot Length (in) |
| --- | --- |
| US 4 | 8.7 |
| US 5 | 8.9 |
| US 6 | 9.3 |
| US 7 | 9.4 |
| US 8 | 9.8 |
| US 9 | 10.0 |
| US 10 | 10.2 |
`.trim(),
  `
COMFORTABLE GLITTER BLOCK HEEL SANDALS FOR WOMEN WITH ANKLE STRAP

These glitter block heel sandals combine a sparkling glitter toe strap with a gold metallic ankle strap and a sturdy jewel-embellished block heel for a glamorous, comfortable look perfect for wedding guest events, date nights, and summer parties.

WHY YOU'LL LOVE IT

Embellished Block Heel: The low, wide block heel features ornate jeweled detailing that delivers all-day stability without sacrificing a dressed-up finish.

Gold Metallic Ankle Strap: Adjustable buckle closure with a delicate charm detail ensures a secure, personalized fit for a variety of foot widths.

Glitter Toe Strap: A bold sparkling upper strap catches the light and elevates the sandal into a statement piece for any occasion.

Jeweled Heel Face: Intricate embellishment along the heel face makes these sandals a polished complement to midi dresses, sundresses, and cropped jeans alike.

These glitter block heel sandals are the perfect choice for wedding guest events, summer parties, date nights, and every stylish occasion in between.

SIZE CHART (IN)

| US Size | Foot Length (in) |
| --- | --- |
| US 4 | 8.7 |
| US 5 | 8.9 |
| US 6 | 9.3 |
| US 7 | 9.4 |
| US 8 | 9.8 |
| US 9 | 10.0 |
| US 10 | 10.2 |
`.trim(),
  `
COMFORTABLE BOHO CROCHET ANKLE-STRAP ESPADRILLE SANDALS FOR WARM-WEATHER DAYS

These women's espadrille sandals combine an open floral crochet upper with a braided jute flatform sole and an adjustable buckle ankle strap for a handcrafted, bohemian-inspired look that works effortlessly for beach boardwalk strolls, summer garden parties, and relaxed weekend brunches.

WHY YOU'LL LOVE IT

Open Floral Crochet Upper: Scalloped crochet detail covers the toe and forefoot with a feminine, handcrafted finish that stands out in any warm-weather setting.

Adjustable Buckle Ankle Strap: Fastens securely at the side with a flat buckle closure, keeping the fit snug and comfortable from morning through evening.

Braided Jute Flatform Sole: A low, even platform lift wrapped in woven jute trim delivers the signature espadrille character with all-day stability underfoot.

Versatile Warm-Weather Pairing: Works with cropped raw-hem jeans and a tee, a flowing midi dress, or a casual summer outfit for nearly any outdoor occasion.

These women's espadrille sandals are the perfect choice for summer garden parties, beach outings, and every relaxed warm-weather occasion in between.

SIZE CHART (IN)

| US Size | Foot Length (in) |
| --- | --- |
| US 4 | 8.7 |
| US 5 | 8.9 |
| US 6 | 9.3 |
| US 7 | 9.4 |
| US 8 | 9.8 |
| US 9 | 10.0 |
| US 10 | 10.2 |
`.trim(),
  `
COMFORTABLE CORK WEDGE PLATFORM SANDALS FOR BOARDWALK STROLLS AND SUMMER OUTINGS

These women's cork wedge thong sandals combine a cushioned footbed with a sturdy cork platform sole and a delicate bow accent at the toe strap for a comfortable, style-forward look perfect for rooftop brunches, farmers market strolls, and casual warm-weather occasions.

WHY YOU'LL LOVE IT

Cork Platform Sole: A bold cork-style wedge adds noticeable, stable lift that keeps you comfortable from the first step to the last without the strain of a stiletto.

Cushioned Footbed: A padded base absorbs impact and reduces foot fatigue so you can wear these sandals through long outings without discomfort.

Thong Toe Strap: A classic between-the-toe thong strap holds the foot securely while keeping that open, relaxed feel you want from warm-weather sandals.

Bow Accent Detail: A soft bow at the toe strap adds a feminine finishing touch that elevates any sundress, wide-leg jean, or poolside look.

These cork wedge platform sandals are the perfect choice for boardwalk strolls, brunch dates, and every comfortable warm-weather occasion in between.

SIZE CHART (IN)

| US Size | Foot Length (in) |
| --- | --- |
| US 4 | 8.7 |
| US 5 | 8.9 |
| US 6 | 9.3 |
| US 7 | 9.4 |
| US 8 | 9.8 |
| US 9 | 10.0 |
| US 10 | 10.2 |
`.trim(),
  `
COMFORTABLE WOVEN LEATHER POINTED TOE SLINGBACK SANDALS FOR BRUNCH, WORK, AND WARM-WEATHER EVENINGS

These comfortable sandals for women combine an intricately woven leather upper with a sleek pointed-toe silhouette and a secure slingback strap for an effortlessly polished, all-day look perfect for weekend brunches, smart-casual workdays, and warm-weather evenings out.

WHY YOU'LL LOVE IT

Woven Leather Upper: Intricate leather weaving delivers a handcrafted, structured finish that holds its shape wear after wear and develops a rich patina over time.

Pointed-Toe Silhouette: The sleek pointed toe elongates the foot for a refined, elevated look that pairs naturally with linen pants, tailored trousers, and sundresses alike.

Slingback Buckle Strap: A heel strap with adjustable buckle closure keeps the fit secure and easy to slip on and off without sacrificing all-day comfort.

Flat Sole Construction: A sturdy flat sole means you can move from a morning errand to an evening dinner without any discomfort or fatigue.

These woven leather slingback sandals are the perfect choice for weekend brunches, casual workdays, garden parties, and every warm-weather occasion in between.

SIZE CHART (IN)

| US Size | Foot Length (in) |
| --- | --- |
| US 5 | 8.9 |
| US 6 | 9.3 |
| US 7 | 9.4 |
| US 8 | 9.8 |
| US 9 | 10.0 |
| US 10 | 10.2 |
`.trim(),
];

const CLIENT_DRESS_EXAMPLE = `
ELEGANT BLACK MAXI DRESS FOR COCKTAIL PARTIES AND FORMAL EVENINGS

This fitted black maxi dress combines a sleek bodice with a flowing A-line skirt and floor-grazing length for an effortlessly polished, cocktail-ready look perfect for formal events, evening occasions, and special celebrations. The clean silhouette pairs naturally with strappy heels, a clutch bag, and simple gold jewelry for a complete evening look that feels refined without trying too hard.

WHY YOU'LL LOVE IT

Fitted Bodice: Hugs the waist before flowing into a flattering A-line shape that creates a balanced, elongating profile from top to hem.

Floor-Grazing Maxi Length: Offers full-length coverage that reads formal and polished for cocktail parties, dinners, and evening events.

A-Line Skirt: Creates a smooth drape through the hips and thighs while keeping movement easy and comfortable all night.

Cocktail Ready Style: Designed for formal events, evening occasions, and special celebration dressing without feeling overdone.

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
WRONG — never write like this:

WHY YOU'LL LOVE IT

Silhouette: The fitted bodice flows into a graceful A-line skirt...
Length: The floor-grazing maxi length adds an air of drama...
Color: Classic black is endlessly versatile...
Material: Made from soft polyester blend for everyday comfort...

Problems: generic labels, polyester mentioned, no headline, no two-sentence intro, no styling detail, missing size chart.
`.trim();

function buildListingPrompt(
  product,
  sheetKeywords,
  productContextText,
  strict = false,
  retryIssues = []
) {
  const strictNote = strict
    ? '\n\nRespond with ONLY valid JSON. No markdown fences or extra text. NEVER mention polyester, poly, or synthetic fabric names — describe texture and construction instead.'
    : '';

  const retryNote =
    retryIssues.length > 0
      ? `\n\nPREVIOUS OUTPUT FAILED VALIDATION — fix every issue below:\n${retryIssues.map((issue) => `- ${issue}`).join('\n')}\n`
      : '';

  const existingDescription = product.existingDescription || '';
  const supplierHadPolyester = /polyester|poly[- ]blend|polycotton|poly cotton|\bpoly\b/i.test(
    existingDescription
  );
  const sanitizedNote = supplierHadPolyester
    ? '\nWARNING: Supplier fabric details were removed because they mentioned polyester/synthetics. Do NOT mention polyester, poly, or synthetic fabrics anywhere in your output. Describe weave, texture, finish, or construction instead.\n'
    : '';

  const sandalExamplesBlock = CLIENT_SANDAL_EXAMPLES.map(
    (example, index) => `CLIENT APPROVED EXAMPLE ${index + 1} — SANDALS:\n${example}`
  ).join('\n\n');

  return `Create a Shopify listing following the MASTER LISTING SOP exactly. Match the tone, depth, structure, and merchandising style of the CLIENT APPROVED EXAMPLES below — copy their rhythm, not their exact words.

PRODUCT INFO:
Title: ${product.title}
Tags: ${product.tags || ''}
Existing Description: ${existingDescription}
${sanitizedNote}
PRODUCT CONTEXT (variants/options — use for color rule and size chart):
${productContextText}

MASTER KEYWORD BANK (priority — pick the most specific matches):
${MASTER_KEYWORD_BANK}

SUPPLEMENTAL KEYWORDS (Google Ads sheet — use only if they match the bank and product):
${sheetKeywords.slice(0, 150).join(', ')}

${LISTING_RULES}

${BANNED_MATERIALS}

${BANNED_BULLET_LABELS}

${BANNED_PHRASES}

${sandalExamplesBlock}

CLIENT APPROVED EXAMPLE — DRESS (match this depth and style):
${CLIENT_DRESS_EXAMPLE}

REJECTED EXAMPLE:
${DESCRIPTION_BAD_EXAMPLE}

RESPOND IN THIS EXACT JSON FORMAT — nothing else:
{
  "title": "Comfortable Woven Closed-Toe Slip-On Sandals for Women with Flat Sole Everyday Style",
  "description": "ALL CAPS HEADLINE\\n\\nOne or two sentence intro...\\n\\nWHY YOU'LL LOVE IT\\n\\nCompound Feature Label: full sentence.\\nCompound Feature Label: full sentence.\\nCompound Feature Label: full sentence.\\nCompound Feature Label: full sentence.\\n\\nThese [product] are the perfect choice for [occasion 1], [occasion 2], and every [adj] occasion in between.\\n\\nSIZE CHART (IN)\\n\\n| US Size | Foot Length (in) |\\n| --- | --- |\\n| US 7 | 9.4 |"
}${strictNote}${retryNote}`;
}

module.exports = {
  buildListingPrompt,
  MASTER_KEYWORD_BANK,
  LISTING_RULES,
  CLIENT_SANDAL_EXAMPLES,
  CLIENT_DRESS_EXAMPLE,
};
