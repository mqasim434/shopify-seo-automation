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

NO FABRIC / NO MATERIAL RULE — CRITICAL:
- NEVER mention fabric, material, or fiber names anywhere in the description
- Banned words include: fabric, material, polyester, poly, linen, cotton, silk, satin, leather, suede, nylon, spandex, rayon, viscose, chiffon, georgette, tulle, fleece, denim, wool, mesh, blend
- Allowed construction language: woven design, crochet detail, platform sole, block heel, button-front, collared neckline, floral print, mandarin collar
- Do NOT copy fabric claims from supplier description — strip them entirely
- Use product images to identify visible design details, not to guess materials

Description format (plain text, use \\n for line breaks):
1. ALL CAPS headline — evocative positioning line (e.g. BREEZY COASTAL STYLE FOR WARM-WEATHER DAYS, ORTHOPEDIC SUPPORT WITH SUMMER STYLE)
2. Intro — 1 to 3 sentences naming construction, silhouette, and occasions (match client sample rhythm)
3. WHY YOU'LL LOVE IT
4. Exactly 4 lines: Feature Label: One full descriptive sentence
5. Closing sentence — warm merchandising line naming product type and occasion (see patterns below)
6. SIZE CHART (IN) — flows directly after closing, no separator line
7. Size chart table using ONLY sizes from product context

Intro rules (CRITICAL — match client samples):
- Open with product type and combine visible construction details with occasions
- Patterns: "The [name/type] combines...", "This [product] combines...", "Flowing in a [silhouette]..."
- Name neckline, sleeve, waist, hem, heel, strap, print, collar, pockets — never fabric names
- Include 2-3 specific occasions: beach holidays, garden parties, wedding guest events, gallery days, etc.

Bullet rules (CRITICAL — match client samples):
- Use descriptive labels: Button-Front Shirt Design, Belted Waist Detail, Orthopedic Support, Bold Floral Print, Woven Design, Versatile Styling
- Each bullet = label + colon + ONE full sentence with specific detail AND a clear benefit
- "Versatile Styling" is allowed as a bullet label when describing pairing/occasions
- NEVER use standalone generic labels alone: Silhouette:, Length:, Color:, Material:, Fabric:, Quality:

Closing sentence patterns (match client samples — pick the best fit):
- "This [product] is the perfect choice for women who want [benefit] for any [occasion type]."
- "These [product] are the perfect [season/category] essential for women who want [benefit]."
- "Whether you are [occasion 1], [occasion 2], or [occasion 3], this [product] delivers [benefit]."

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

Never: fabric names, material names, polyester, em dashes, AI-sounding prose, separator lines before size chart, EU sizing, branded keywords, more than one feeling word, acknowledging these instructions in output.
`.trim();

const BANNED_MATERIALS = `
NEVER mention in the description — not in intro, bullets, or closing:
fabric, material, polyester, poly, linen, cotton, silk, satin, leather, suede, nylon, spandex, rayon, viscose, chiffon, georgette, tulle, fleece, denim, wool, acrylic, blend, synthetic

ALLOWED construction language (not material names):
woven design, crochet detail, platform sole, block heel, button-front, collared neckline, floral print, mandarin collar, cross-strap fit
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

const CLIENT_APPROVED_EXAMPLES = [
  `
BREEZY COASTAL STYLE FOR WARM-WEATHER DAYS

The Brittany dress combines effortless boho ease with a button-front design, collared neckline, belted waist, and floor-length maxi cut for relaxed, put-together style perfect for beach holidays, casual outings, and warm-weather occasions.

WHY YOU'LL LOVE IT

Button-Front Shirt Design: A classic, feminine neckline that adds effortless boho sophistication to any casual warm-weather look.

Belted Waist Detail: A flattering, defined silhouette that flows beautifully into the maxi skirt.

Flowing Maxi Length: A floor-grazing cut that moves beautifully for any casual coastal occasion.

Versatile Styling: Pairs beautifully with sandals or espadrilles for beach days, holidays, or casual summer outings.

This dress is the perfect choice for women who want effortless boho style for any casual warm-weather occasion.

SIZE CHART (IN)

| Size | Bust | Waist | Length |
| --- | --- | --- | --- |
| S | 35.5 | 27.5 | 57 |
| M | 37.0 | 29.0 | 57 |
| L | 38.5 | 30.5 | 57 |
| XL | 40.5 | 32.5 | 57 |
`.trim(),
  `
FREE SPIRITED BOHO CHARM FOR EVERY DAY

Flowing in a relaxed high waist silhouette, this printed shirt dress brings easy, statement making style to your wardrobe. It pairs a structured stand collar with a full length button front and a gently gathered waist for a look that feels both polished and effortlessly relaxed. The sweeping skirt makes it the perfect dress for gallery days, garden gatherings, or sunny weekend strolls.

WHY YOU'LL LOVE IT

Flowing Maxi Silhouette: The long, breezy cut skims the body for relaxed all day comfort.

Structured Stand Collar: A crisp stand collar and button placket add a sharp, put together touch.

Flattering High Waist: Soft gathering at the waist defines the midsection for a beautifully feminine shape.

Convenient Side Pockets: Handy pockets bring everyday ease without disrupting the clean silhouette.

Whether you are exploring a gallery, enjoying a garden gathering, or strolling on a sunny weekend, this printed maxi dress delivers effortless bohemian style.

SIZE CHART (IN)

| Size | Bust | Waist | Length |
| --- | --- | --- | --- |
| S | 35.5 | 27.5 | 57 |
| M | 37.0 | 29.0 | 57 |
| L | 38.5 | 30.5 | 57 |
| XL | 40.5 | 32.5 | 57 |
`.trim(),
  `
ORTHOPEDIC SUPPORT WITH SUMMER STYLE

The Suzanne sandals combine serious orthopedic comfort with a sleek platform design. A cross-strap fit, cushioned sole, and open-toe silhouette make these the perfect warm-weather essential for women on the go.

WHY YOU'LL LOVE IT

Orthopedic Support: Designed to reduce foot fatigue and keep you comfortable all day long.

Platform Sole: A stable, comfortable lift for extended wear throughout the day.

Cross-Strap Fit: Ensures a secure, personalized fit for every foot shape.

Versatile Styling: Pairs effortlessly with jeans, dresses, or casual summer outfits.

These sandals are the perfect summer essential for women who want serious orthopedic comfort with everyday style.

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
  `
BOLD FLORAL ELEGANCE FOR EVERY SPECIAL OCCASION

The Elaine dress combines a striking bold floral print with effortless formal drama. A wrap V-neck, flowing cape sleeves, and floor-length A-line maxi cut make this the perfect dress for weddings, garden galas, or any occasion that calls for a truly unforgettable look.

WHY YOU'LL LOVE IT

Bold Floral Print: A dramatic, eye-catching pattern that commands attention at any formal wedding or special occasion.

Wrap V-Neck with Cape Sleeves: A graceful, flowing silhouette that adds effortless formal elegance to the maxi length.

Floor-Length A-Line Cut: A sweeping silhouette that moves beautifully for any dressed-up warm-weather event.

Versatile Styling: Pairs beautifully with strappy heels or statement earrings for weddings, garden galas, or formal evening occasions.

This dress is the perfect choice for women who want elegant bold floral style for any formal wedding guest occasion.

SIZE CHART (IN)

| Size | Bust | Waist | Length |
| --- | --- | --- | --- |
| S | 35.5 | 27.5 | 57 |
| M | 37.0 | 29.0 | 57 |
| L | 38.5 | 30.5 | 57 |
| XL | 40.5 | 32.5 | 57 |
`.trim(),
  `
DARK ROMANCE FOR EVERY FORMAL OCCASION

This black floral midi dress combines a structured mandarin collar with a keyhole neckline, cinched waist, and sweeping A-line pleated skirt for a breathtaking, vintage-inspired silhouette. A bold botanical print, cap sleeves, and dramatic floral hem make this the perfect formal wedding guest dress for any elegant evening occasion.

WHY YOU'LL LOVE IT

Bold Floral Print on Black: A striking, dark romantic pattern that commands attention at any formal event.

Mandarin Collar with Keyhole: A refined, editorial neckline detail that adds instant sophistication to the look.

Sweeping A-Line Pleated Skirt: A dramatic, flattering silhouette that flows beautifully with every step.

Cinched Waist Detail: Defines the figure elegantly for a polished, hourglass-enhancing formal look.

This dress is the perfect choice for women who want an elegant black floral dress for any formal wedding guest or special occasion.

SIZE CHART (IN)

| Size | Bust | Waist | Length |
| --- | --- | --- | --- |
| S | 35.5 | 27.5 | 45 |
| M | 37.0 | 29.0 | 45 |
| L | 38.5 | 30.5 | 45 |
| XL | 40.5 | 32.5 | 45 |
`.trim(),
  `
EFFORTLESS ELEGANCE FOR EVERY DAY

The Lisa flats combine a timeless woven design with all-day comfort. A pointed toe silhouette, slip-on fit, and lightweight sole make these the perfect everyday flat for women who want effortless style from morning to night.

WHY YOU'LL LOVE IT

Woven Design: A unique, textured finish that adds elegance to any casual or smart outfit.

Pointed Toe Silhouette: A sleek, timeless look that pairs beautifully with any outfit.

Easy Slip-On Fit: No laces, no fuss — effortless style every time.

Lightweight Sole: Extra comfort for extended wear throughout the day.

These flats are the perfect everyday essential for women who want effortless elegance with all-day comfort.

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
  `
TAILORED ELEGANCE FOR EVERY OCCASION

This vest and wide-leg pants set combines a structured sleeveless lapel vest with relaxed wide-leg trousers for a polished, fashion-forward co-ord look. A button-front vest and flowing trouser silhouette make this the perfect set for formal outings, garden parties, or any dressed-up warm-weather occasion.

WHY YOU'LL LOVE IT

Structured Lapel Vest: A tailored, sophisticated upper that adds instant polish and elegance to the set.

Relaxed Wide-Leg Cut: A flattering, flowing silhouette that elongates the legs beautifully.

Matching Co-Ord Set: Effortlessly styled from head to toe — formal elegance with zero effort required.

Versatile Styling: Pairs with heels for garden parties or sandals for warm-weather formal outings.

This set is the perfect choice for women who want an elegant vest and wide-leg pants set for any formal or dressed-up occasion.

SIZE CHART (IN)

| Size | Bust | Waist | Length |
| --- | --- | --- | --- |
| S | 35.5 | 27.5 | 55 |
| M | 37.0 | 29.0 | 55 |
| L | 38.5 | 30.5 | 55 |
| XL | 40.5 | 32.5 | 55 |
`.trim(),
];

const DESCRIPTION_BAD_EXAMPLE = `
WRONG — never write like this:

WHY YOU'LL LOVE IT

Silhouette: The fitted bodice flows into an A-line skirt...
Length: The floor-grazing maxi length adds drama...
Color: Classic black is endlessly versatile...
Soft Linen Fabric: Lightweight and breathable for all-day comfort...
Material: Made from soft polyester blend for everyday comfort...

Problems: generic labels, fabric/material mentioned, no headline, no intro, missing size chart.
`.trim();

function buildListingPrompt(
  product,
  sheetKeywords,
  productContextText,
  visionContextText,
  strict = false,
  retryIssues = []
) {
  const strictNote = strict
    ? '\n\nRespond with ONLY valid JSON. No markdown fences or extra text. NEVER mention fabric, material, polyester, or any fiber names — describe construction and design only.'
    : '';

  const retryNote =
    retryIssues.length > 0
      ? `\n\nPREVIOUS OUTPUT FAILED VALIDATION — fix every issue below:\n${retryIssues.map((issue) => `- ${issue}`).join('\n')}\n`
      : '';

  const existingDescription = product.existingDescription || '';
  const supplierHadFabric = /fabric|material|polyester|poly[- ]blend|linen|cotton|silk|satin|leather|\bpoly\b/i.test(
    existingDescription
  );
  const sanitizedNote = supplierHadFabric
    ? '\nWARNING: Supplier description contained fabric/material claims — those were removed. Do NOT mention fabric, material, or fiber names anywhere in your output. Use construction and design language only.\n'
    : '';

  const examplesBlock = CLIENT_APPROVED_EXAMPLES.map(
    (example, index) => `CLIENT APPROVED EXAMPLE ${index + 1}:\n${example}`
  ).join('\n\n');

  return `Create a Shopify listing following the MASTER LISTING SOP exactly. Match the tone, depth, structure, and merchandising style of the CLIENT APPROVED EXAMPLES below — copy their rhythm and format, not their exact words.

${visionContextText}

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

${examplesBlock}

REJECTED EXAMPLE:
${DESCRIPTION_BAD_EXAMPLE}

RESPOND IN THIS EXACT JSON FORMAT — nothing else:
{
  "title": "Effortless Boho Maxi Dress for Women with Button Front Belted Waist Coastal Style",
  "description": "ALL CAPS HEADLINE\\n\\nIntro paragraph(s)...\\n\\nWHY YOU'LL LOVE IT\\n\\nFeature Label: full sentence.\\nFeature Label: full sentence.\\nFeature Label: full sentence.\\nFeature Label: full sentence.\\n\\nClosing sentence.\\n\\nSIZE CHART (IN)\\n\\n| Size | Bust | Waist | Length |\\n| --- | --- | --- | --- |\\n| M | 37.0 | 29.0 | 57 |"
}${strictNote}${retryNote}`;
}

module.exports = {
  buildListingPrompt,
  MASTER_KEYWORD_BANK,
  LISTING_RULES,
  CLIENT_APPROVED_EXAMPLES,
};
