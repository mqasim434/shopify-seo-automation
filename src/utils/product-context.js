function getOptionValues(product, optionName) {
  const option = product.options?.find(
    (entry) => entry.name?.toLowerCase() === optionName.toLowerCase()
  );

  if (option?.values?.length) {
    return option.values.filter(Boolean);
  }

  const optionIndex = product.options?.findIndex(
    (entry) => entry.name?.toLowerCase() === optionName.toLowerCase()
  );

  if (optionIndex === undefined || optionIndex < 0) {
    return [];
  }

  const optionKey = `option${optionIndex + 1}`;
  const values = new Set();

  for (const variant of product.variants || []) {
    const value = variant[optionKey];
    if (value) values.add(value);
  }

  return [...values];
}

function getProductContext(product) {
  const colors = getOptionValues(product, 'color');
  const sizes = getOptionValues(product, 'size');
  const options = (product.options || []).map((option) => ({
    name: option.name,
    values: option.values || getOptionValues(product, option.name),
  }));

  return {
    colors,
    sizes,
    colorVariantCount: colors.length,
    options,
    variantCount: product.variants?.length || 0,
  };
}

function formatProductContext(context) {
  const lines = [
    `Size options: ${context.sizes.length ? context.sizes.join(', ') : 'Not specified — infer from product details'}`,
    `Color options (${context.colorVariantCount}): ${context.colors.length ? context.colors.join(', ') : 'Not specified — infer from product details'}`,
    `Color rule: ${context.colorVariantCount === 1 ? 'Single color variant → include that color in title' : context.colorVariantCount > 1 ? 'Multiple color variants → do NOT include color in title' : 'If color count unknown, infer from title/tags; single obvious color → include it'}`,
  ];

  if (context.options.length > 1) {
    lines.push(
      `All options: ${context.options.map((o) => `${o.name}: ${o.values.join(', ')}`).join(' | ')}`
    );
  }

  return lines.join('\n');
}

module.exports = { getProductContext, formatProductContext };
