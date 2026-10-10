import { Heart, LoaderCircle } from "lucide-react";

import useWishlist from "../hooks/useWishlist";
import WishlistItem from "../components/WishlistItem";
import EmptyWishlist from "../components/EmptyWishlist";

import styles from "./Wishlist.module.css";

const Wishlist = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useWishlist({
    limit: 100,
  });

  const items =
    data?.pages?.flatMap((page) => page?.data?.wishlist ?? []) ?? [];

  const totalItems =
    data?.pages?.[0]?.data?.pagination?.totalItems ?? items.length;

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <LoaderCircle size={28} className={styles.spinner} />

          <p>Loading your wishlist...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <div className={styles.error}>
          <h1>Unable to load wishlist</h1>

          <p>
            {error?.response?.data?.message ||
              "Something went wrong while loading your wishlist."}
          </p>

          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleRow}>
              <Heart size={24} />

              <h1>Wishlist</h1>
            </div>

            <p>
              {totalItems === 0
                ? "Products you save will appear here."
                : `${totalItems} ${totalItems === 1 ? "item" : "items"} saved`}
            </p>
          </div>
        </header>

        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            <div className={styles.list}>
              {items.map((item) => (
                <WishlistItem key={item.id} item={item} />
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
      </div>
    </main>
  );
};

export default Wishlist;
