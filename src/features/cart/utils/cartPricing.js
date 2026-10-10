export const getCartPricing = (cart) => {
  const subtotal = Number(cart?.subtotal ?? cart?.pricing?.subtotal ?? 0);
  const discount = Number(
    cart?.discount_amount ?? cart?.discount ?? cart?.pricing?.discount ?? 0,
  );

  const shipping = Number(
    cart?.shipping_cost ?? cart?.shipping ?? cart?.pricing?.shipping ?? 0,
  );

  const total = Math.max(0, subtotal - discount + shipping);

  return {
    subtotal,
    discount,
    shipping,
    total,
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
};
