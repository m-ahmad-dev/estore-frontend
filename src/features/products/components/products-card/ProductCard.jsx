import { useNavigate } from "react-router-dom";

import styles from "./ProductCard.module.css";
import IsDark from "../../../../utils/themeUtility/isDark.jsx";
import WishlistButton from "../../../wishlist/components/WishlistButton.jsx";

const ProductCard = ({ product }) => {
  const isDark = IsDark();
  const navigate = useNavigate();

  const primaryImage =
    product?.images?.find((image) => image.is_primary)?.url ??
    product?.images?.[0]?.url;

  const handleClick = () => {
    if (product?.slug) {
      navigate(`/products/${product.slug}`);
    }
  };

  return (
    <article
      className={`${styles.card} ${
        isDark ? styles.cardDark : styles.cardLight
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleClick();
        }
      }}
    >
      <div className={styles.imageWrapper}>
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div
            className={`${styles.imagePlaceholder} ${
              isDark ? styles.placeholderDark : styles.placeholderLight
            }`}
          >
            No image
          </div>
        )}

        <div className={styles.wishlistAction}>
          <WishlistButton productId={product?.id} size={18} />
        </div>
      </div>

      <div className={styles.content}>
        <p
          className={`${styles.category} ${
            isDark ? styles.textMutedDark : styles.textMutedLight
          }`}
        >
          {product?.category?.name ?? "Product"}
        </p>

        <h2 className={styles.name}>{product?.name}</h2>

        <div className={styles.bottom}>
          <span className={styles.price}>
            Rs. {Number(product?.base_price ?? 0).toLocaleString()}
          </span>

          <span
            className={`${styles.reviews} ${
              isDark ? styles.textMutedDark : styles.textMutedLight
            }`}
          >
            {product?.reviews ?? 0} reviews
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
