import { Heart } from "lucide-react";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../../auth/authSelectors";
import useWishlist from "../hooks/useWishlist";
import useAddToWishlist from "../hooks/useAddToWishlist";
import useRemoveFromWishlist from "../hooks/useRemoveFromWishlist";

import styles from "./WishlistButton.module.css";

const WishlistButton = ({
  productId,
  size = 18,
  className = "",
  showLabel = false,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data, isLoading: isWishlistLoading } = useWishlist();

  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const wishlistItems =
    data?.pages?.flatMap((page) => page?.data?.wishlist ?? []) ?? [];

  const wishlistItem = wishlistItems.find(
    (item) => item.product?.id === productId,
  );

  const isWishlisted = Boolean(wishlistItem);

  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated || !productId || isPending) {
      return;
    }

    if (isWishlisted) {
      removeMutation.mutate(wishlistItem.id);
      return;
    }

    addMutation.mutate(productId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={handleClick}
      disabled={isPending || isWishlistLoading}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isWishlisted}
    >
      <Heart
        size={size}
        fill={isWishlisted ? "currentColor" : "none"}
        strokeWidth={isWishlisted ? 2.2 : 1.8}
        aria-hidden="true"
      />

      {showLabel && (
        <span>
          {isPending
            ? "Updating..."
            : isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
