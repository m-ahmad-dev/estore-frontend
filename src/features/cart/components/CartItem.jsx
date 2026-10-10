import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useUpdateCartItem from "../hooks/useUpdateCartItem";
import useRemoveCartItem from "../hooks/useRemoveCartItem";
import { getCartVariant, removeCartVariant } from "../utils/cartStorage";
import { getCartErrorMessage } from "../utils/cartError";

import styles from "./CartItem.module.css";

const CartItem = ({ item }) => {
  const navigate = useNavigate();

  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const metadata = getCartVariant(item.variant_id);

  const isUpdating = updateMutation.isPending;
  const isRemoving = removeMutation.isPending;

  const image = metadata?.image;
  const name = metadata?.name ?? "Product";
  const attributes = metadata?.attributes ?? {};
  const slug = metadata?.slug;

  const updateQuantity = (action) => {
    if (isUpdating || isRemoving) {
      return;
    }

    updateMutation.mutate({
      itemId: item.id,
      action,
      quantity: 1,
    });
  };

  const handleRemove = () => {
    if (isUpdating || isRemoving) {
      return;
    }

    removeMutation.mutate(item.id, {
      onSuccess: () => {
        removeCartVariant(item.variant_id);
      },
    });
  };

  const handleProductClick = () => {
    if (slug) {
      navigate(`/products/${slug}`);
    }
  };

  return (
    <article className={styles.item}>
      <button
        type="button"
        className={styles.imageButton}
        onClick={handleProductClick}
        disabled={!slug}
        aria-label={`View ${name}`}
      >
        {image ? (
          <img src={image} alt={name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>No image</div>
        )}
      </button>

      <div className={styles.details}>
        <button
          type="button"
          className={styles.name}
          onClick={handleProductClick}
          disabled={!slug}
        >
          {name}
        </button>

        {Object.keys(attributes).length > 0 && (
          <div className={styles.attributes}>
            {Object.entries(attributes).map(([key, value]) => (
              <span key={key}>
                {formatAttributeName(key)}: {String(value)}
              </span>
            ))}
          </div>
        )}

        <p className={styles.sku}>
          SKU: {item.variant?.sku ?? metadata?.sku ?? "N/A"}
        </p>

        <div className={styles.price}>
          Rs. {Number(item.unit_price).toLocaleString()}
        </div>

        {updateMutation.isError && (
          <p className={styles.error}>
            {getCartErrorMessage(updateMutation.error)}
          </p>
        )}

        {removeMutation.isError && (
          <p className={styles.error}>
            {getCartErrorMessage(removeMutation.error)}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.quantityControl}>
          <button
            type="button"
            onClick={() => updateQuantity("decrement")}
            disabled={item.quantity <= 1 || isUpdating || isRemoving}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>

          <span>{item.quantity}</span>

          <button
            type="button"
            onClick={() => updateQuantity("increment")}
            disabled={isUpdating || isRemoving}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className={styles.lineTotal}>
          Rs. {Number(item.line_total).toLocaleString()}
        </div>

        <button
          type="button"
          className={styles.removeButton}
          onClick={handleRemove}
          disabled={isUpdating || isRemoving}
          aria-label={`Remove ${name}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
};

const formatAttributeName = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export default CartItem;
