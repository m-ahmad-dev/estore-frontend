// src/features/orders/pages/Orders.jsx
import { LoaderCircle, Package, RefreshCw } from "lucide-react";
import { useState } from "react";
import useCustomerOrders from "../hooks/useCustomerOrders";
import OrderCard from "../components/OrderCard";
import styles from "./Orders.module.css";

const STATUS_OPTIONS = [
  { value: "", label: "All orders" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const Orders = () => {
  const [status, setStatus] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCustomerOrders({ status: status || undefined });

  const orders = data?.pages?.flatMap((page) => page?.data?.orders ?? []) ?? [];

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <LoaderCircle className={styles.spinner} size={28} />
          <span>Loading your orders...</span>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <Package size={34} />
          <h1>Unable to load orders</h1>
          <p>
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong while loading your orders."}
          </p>
          <button type="button" onClick={() => refetch()}>
            <RefreshCw size={16} />
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
            <p className={styles.eyebrow}>Account</p>
            <h1>My Orders</h1>
            <p className={styles.description}>
              View and track your previous orders.
            </p>
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.filter}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </header>

        {isFetching && !isLoading && (
          <div className={styles.refreshing}>
            <LoaderCircle className={styles.smallSpinner} size={15} />
            Updating orders...
          </div>
        )}

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <Package size={38} />
            <h2>No orders found</h2>
            <p>
              {status
                ? "There are no orders with this status."
                : "You have not placed any orders yet."}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.orders}>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {hasNextPage && (
              <div className={styles.loadMore}>
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more orders"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Orders;
