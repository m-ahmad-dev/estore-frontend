const STORAGE_KEY = "estore-cart-variants";

const readStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);

    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage is only a display enhancement.
  }
};

export const saveCartVariant = (product, variant) => {
  if (!product || !variant?.id) {
    return;
  }

  const current = readStorage();

  current[variant.id] = {
    variantId: variant.id,
    productId: product.id ?? null,
    name: product.name ?? "Product",
    slug: product.slug ?? null,
    image:
      product.images?.find((image) => image.is_primary)?.url ??
      product.images?.[0]?.url ??
      null,
    attributes: variant.attributes ?? {},
    sku: variant.sku ?? null,
  };

  writeStorage(current);
};

export const getCartVariant = (variantId) => {
  if (!variantId) {
    return null;
  }

  const current = readStorage();

  return current[variantId] ?? null;
};

export const removeCartVariant = (variantId) => {
  if (!variantId) {
    return;
  }

  const current = readStorage();
  delete current[variantId];

  writeStorage(current);
};

export const clearCartVariantStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
};
