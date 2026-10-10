import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../schemas/reviewSchema";
import styles from "./ReviewForm.module.css";

const ReviewForm = ({
  initialReview = null,
  orderId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEdit = Boolean(initialReview);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateReviewSchema : createReviewSchema),
    defaultValues: {
      order_id: orderId || initialReview?.order_id || "",
      rating: initialReview?.rating || 5,
      title: initialReview?.title || "",
      comment: initialReview?.comment || "",
    },
  });

  const rating = useWatch({
    control,
    name: "rating",
    defaultValue: initialReview?.rating || 5,
  });

  const submit = (values) => {
    if (isEdit) {
      const { order_id: _order_id, ...rest } = values;
      onSubmit(rest);
    } else {
      onSubmit(values);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.heading}>
        <h3>{isEdit ? "Edit review" : "Write a review"}</h3>
        <p>
          {isEdit
            ? "Update your feedback. Approved reviews will go back to pending."
            : "Share your experience with this product."}
        </p>
      </div>

      {!isEdit && <input type="hidden" {...register("order_id")} />}

      <div className={styles.ratingField}>
        <span>Rating</span>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={value <= rating ? styles.starActive : styles.star}
              onClick={() =>
                setValue("rating", value, { shouldValidate: true })
              }
              disabled={isSubmitting}
            >
              <Star
                size={22}
                fill={value <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className={styles.error}>{errors.rating.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="title">Title (optional)</label>
        <input
          id="title"
          {...register("title")}
          placeholder="Sum up your experience"
          disabled={isSubmitting}
        />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="comment">Comment (optional)</label>
        <textarea
          id="comment"
          rows={4}
          {...register("comment")}
          placeholder="What did you like or dislike?"
          disabled={isSubmitting}
        />
        {errors.comment && (
          <p className={styles.error}>{errors.comment.message}</p>
        )}
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancel}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update review"
              : "Submit review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
