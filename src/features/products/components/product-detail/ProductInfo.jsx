import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingCart, Star } from "lucide-react";

import styles from "./ProductInfo.module.css";
import useAddToCart from "../../../cart/hooks/useAddToCart.js";
import { saveCartVariant } from "../../../cart/utils/cartStorage.js";
import { getCartErrorMessage } from "../../../cart/utils/cartError.js";
import WishlistButton from "../../../wishlist/components/WishlistButton.jsx";

const ProductInfo = ({ product }) => {
  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? "",
  );

  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const addToCartMutation = useAddToCart();

  const selectedVariant = useMemo(
    () =>
      variants.find((variant) => variant.id === selectedVariantId) ??
      variants[0] ??
      null,
    [variants, selectedVariantId],
  );

  const price = selectedVariant?.price ?? product.base_price;

  const availableQuantity = selectedVariant?.available_quantity ?? 0;

  const isInStock = selectedVariant?.in_stock ?? false;

  const increaseQuantity = () => {
    if (!isInStock) {
      return;
    }

    setQuantity((current) => Math.min(current + 1, availableQuantity));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleVariantChange = (variantId) => {
    setSelectedVariantId(variantId);
    setQuantity(1);
    setSuccessMessage("");
    addToCartMutation.reset();
  };

  const handleAddToCart = () => {
    if (!selectedVariant?.id || !isInStock) {
      return;
    }

    setSuccessMessage("");

    addToCartMutation.mutate(
      {
        variant_id: selectedVariant.id,
        quantity,
      },
      {
        onSuccess: () => {
          saveCartVariant(product, selectedVariant);
          setSuccessMessage("Added to cart successfully.");
        },
      },
    );
  };

  return (
    <div className={styles.info}>
      <div className={styles.category}>{product.category?.name}</div>

      <h1 className={styles.title}>{product.name}</h1>

      <div className={styles.ratingRow}>
        <div className={styles.rating}>
          <Star size={16} fill="currentColor" />
          <span>{product.reviews ?? 0}</span>
        </div>

        <span className={styles.ratingLabel}>
          {product.reviews === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className={styles.price}>Rs. {Number(price).toLocaleString()}</div>

      <div className={styles.divider} />

      {product.description && (
        <div className={styles.description}>
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>
      )}

      {variants.length > 0 && (
        <div className={styles.variants}>
          <h2>Options</h2>

          <div className={styles.variantList}>
            {variants.map((variant, index) => {
              const isSelected = variant.id === selectedVariantId;

              return (
                <button
                  key={variant.id}
                  type="button"
                  className={`${styles.variantButton} ${
                    isSelected ? styles.variantSelected : ""
                  }`}
                  onClick={() => handleVariantChange(variant.id)}
                >
                  <div className={styles.variantHeader}>
                    <span>Option {index + 1}</span>

                    {isSelected && <Check size={16} aria-hidden="true" />}
                  </div>

                  <div className={styles.attributes}>
                    {Object.entries(variant.attributes ?? {}).map(
                      ([key, value]) => (
                        <span key={key}>
                          {formatAttributeName(key)}: {value}
                        </span>
                      ),
                    )}
                  </div>

                  <div className={styles.variantPrice}>
                    Rs. {Number(variant.price).toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.stockRow}>
        <span
          className={`${styles.stockStatus} ${
            isInStock ? styles.stockAvailable : styles.stockUnavailable
          }`}
        >
          <span className={styles.stockDot} />

          {isInStock ? "In stock" : "Out of stock"}
        </span>

        {isInStock && (
          <span className={styles.stockQuantity}>
            {availableQuantity} available
          </span>
        )}
      </div>

      <div className={styles.purchaseRow}>
        <div className={styles.quantityControl}>
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || addToCartMutation.isPending}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={
              !isInStock ||
              quantity >= availableQuantity ||
              addToCartMutation.isPending
            }
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          className={styles.addToCart}
          disabled={
            !isInStock || !selectedVariant?.id || addToCartMutation.isPending
          }
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} />

          {!isInStock
            ? "Out of stock"
            : addToCartMutation.isPending
              ? "Adding..."
              : "Add to cart"}
        </button>

        <WishlistButton
          productId={product?.id}
          size={20}
          className={styles.wishlistButton}
          showLabel
        />
      </div>

      {addToCartMutation.isError && (
        <p
          style={{
            marginTop: "12px",
            color: "rgb(220 38 38)",
            fontSize: "14px",
          }}
        >
          {getCartErrorMessage(
            addToCartMutation.error,
            "Unable to add this item to your cart.",
          )}
        </p>
      )}

      {successMessage && (
        <p
          style={{
            marginTop: "12px",
            color: "rgb(22 101 52)",
            fontSize: "14px",
          }}
        >
          {successMessage}
        </p>
      )}
    </div>
  );
};

const formatAttributeName = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export default ProductInfo;
