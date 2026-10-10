import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useRemoveFromWishlist from "../hooks/useRemoveFromWishlist";

import styles from "./WishlistItem.module.css";

const WishlistItem = ({ item }) => {
  const navigate = useNavigate();
  const removeMutation = useRemoveFromWishlist();

  const product = item?.product;

  const image = product?.primary_image?.url;

  const handleOpenProduct = () => {
    if (product?.slug) {
      navigate(`/products/${product.slug}`);
    }
  };

  const handleRemove = () => {
    if (!item?.id || removeMutation.isPending) {
      return;
    }

    removeMutation.mutate(item.id);
  };

  return (
    <article className={styles.item}>
      <button
        type="button"
        className={styles.productButton}
        onClick={handleOpenProduct}
      >
        <div className={styles.imageWrapper}>
          {image ? (
            <img
              src={image}
              alt={product?.primary_image?.alt_text || product?.name}
              className={styles.image}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder}>No image</div>
          )}
        </div>

        <div className={styles.content}>
          <h2>{product?.name}</h2>

          <p className={styles.description}>
            {product?.description || "No description available."}
          </p>

          <div className={styles.meta}>
            <span className={styles.price}>
              Rs. {Number(product?.base_price ?? 0).toLocaleString()}
            </span>

            {!product?.is_active && (
              <span className={styles.unavailable}>Unavailable</span>
            )}
          </div>
        </div>
      </button>

      <button
        type="button"
        className={styles.removeButton}
        onClick={handleRemove}
        disabled={removeMutation.isPending}
        aria-label={`Remove ${product?.name || "item"} from wishlist`}
      >
        <Trash2 size={18} />

        <span>{removeMutation.isPending ? "Removing..." : "Remove"}</span>
      </button>
    </article>
  );
};

export default WishlistItem;
