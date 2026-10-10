import { Star, Pencil, Trash2, Package } from "lucide-react";
import styles from "./ReviewCard.module.css";
import IsDark from "../../../utils/themeUtility/isDark.jsx";

const STATUS_STYLES = {
  PENDING: styles.pending,
  APPROVED: styles.approved,
  REJECTED: styles.rejected,
};

const ReviewCard = ({ review, onEdit, onDelete, disabled = false }) => {
  const isDark = IsDark();
  const product = review.product;

  return (
    <article className={`${styles.card} ${isDark ? styles.dark : ""}`}>
      <div className={styles.top}>
        <div className={styles.product}>
          {product?.image ? (
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder}>
              <Package size={20} />
            </div>
          )}
          <div>
            <h3>{product?.name || "Product"}</h3>
            {product?.slug && (
              <a
                href={`/products/${product.slug}`}
                className={styles.slug}
                onClick={(e) => e.stopPropagation()}
              >
                View product
              </a>
            )}
          </div>
        </div>

        <span
          className={`${styles.badge} ${STATUS_STYLES[review.status] || ""}`}
        >
          {review.status}
        </span>
      </div>

      <div className={styles.rating}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < review.rating ? "currentColor" : "none"}
            className={i < review.rating ? styles.starFilled : styles.starEmpty}
          />
        ))}
        <span>{review.rating}/5</span>
      </div>

      {review.title && <h4 className={styles.title}>{review.title}</h4>}
      {review.comment && <p className={styles.comment}>{review.comment}</p>}

      {review.status === "REJECTED" && review.rejection_reason && (
        <p className={styles.rejection}>
          <strong>Reason:</strong> {review.rejection_reason}
        </p>
      )}

      <div className={styles.meta}>
        <span>
          {new Date(review.created_at).toLocaleDateString("en-PK", {
            dateStyle: "medium",
          })}
        </span>
        {review.verified_purchase && (
          <span className={styles.verified}>Verified purchase</span>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className={styles.actions}>
          {onEdit && (
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => onEdit(review)}
              disabled={disabled}
            >
              <Pencil size={15} />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => onDelete(review)}
              disabled={disabled}
            >
              <Trash2 size={15} />
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default ReviewCard;
