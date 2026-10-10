import { useState } from "react";
import { LoaderCircle, MessageSquare } from "lucide-react";
import useMyReviews from "../hooks/useMyReviews";
import useUpdateReview from "../hooks/useUpdateReview";
import useDeleteReview from "../hooks/useDeleteReview";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import styles from "./MyReviewsList.module.css";
import IsDark from "../../../utils/themeUtility/isDark.jsx";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const MyReviewsList = () => {
  const isDark = IsDark();
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useMyReviews({ status: status || undefined });

  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const reviews = data?.pages?.flatMap((page) => page?.reviews ?? []) ?? [];
  const total = data?.pages?.[0]?.pagination?.totalReviews ?? reviews.length;

  const handleUpdate = (values) => {
    if (!editing?.id) return;
    updateMutation.mutate(
      { reviewId: editing.id, data: values },
      {
        onSuccess: () => setEditing(null),
      },
    );
  };

  const handleDelete = (review) => {
    const ok = window.confirm(
      `Delete your review for "${review.product?.name || "this product"}"?`,
    );
    if (!ok) return;
    deleteMutation.mutate(review.id);
  };

  if (isLoading) {
    return (
      <div className={styles.state}>
        <LoaderCircle size={24} className={styles.spinner} />
        <span>Loading your reviews...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.state}>
        <h3>Unable to load reviews</h3>
        <p>
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong."}
        </p>
        <button type="button" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className={`${styles.section} ${isDark ? styles.dark : ""}`}>
      <div className={styles.header}>
        <div>
          <h2>My Reviews</h2>
          <p>
            {total === 0
              ? "You have not written any reviews yet."
              : `${total} review${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.filter}
        >
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {editing && (
        <div className={styles.formWrap}>
          <ReviewForm
            initialReview={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            isSubmitting={updateMutation.isPending}
          />
          {updateMutation.isError && (
            <p className={styles.mutationError}>
              {updateMutation.error?.response?.data?.message ||
                "Unable to update review."}
            </p>
          )}
        </div>
      )}

      {deleteMutation.isError && (
        <p className={styles.mutationError}>
          {deleteMutation.error?.response?.data?.message ||
            "Unable to delete review."}
        </p>
      )}

      {reviews.length === 0 ? (
        <div className={styles.empty}>
          <MessageSquare size={32} />
          <h3>No reviews yet</h3>
          <p>
            After you receive a delivered order you can review the products from
            the order details page.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={setEditing}
                onDelete={handleDelete}
                disabled={deleteMutation.isPending}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className={styles.loadMore}>
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MyReviewsList;
