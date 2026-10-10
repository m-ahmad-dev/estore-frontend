// src/features/orders/pages/OrderDetails.jsx
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  LoaderCircle,
  Package,
  Truck,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useCustomerOrder from "../hooks/useCustomerOrder";
import { createOrderPaymentSession } from "../services/orderApi";
import useCancelOrder from "../hooks/useCancelOrder";
import OrderItem from "../components/OrderItem";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderSummary from "../components/OrderSummary";
import styles from "./OrderDetails.module.css";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, isError, error, refetch } = useCustomerOrder(id);
  const cancelMutation = useCancelOrder();
  const retryPaymentMutation = useMutation({ mutationFn: createOrderPaymentSession });

  const order = data?.order ?? data?.data?.order;
  const justCreated = location.state?.orderCreated === true;
  const paymentResult = new URLSearchParams(location.search).get("payment");

  const canCancel = order && ["PENDING", "CONFIRMED"].includes(order.status);

  const handleCancel = () => {
    if (!order || cancelMutation.isPending) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmed) return;

    cancelMutation.mutate({ orderId: order.id });
  };

  const handleRetryPayment = () => {
    if (!order || retryPaymentMutation.isPending) return;
    retryPaymentMutation.mutate(order.id, {
      onSuccess: (result) => {
        const checkoutUrl = result?.data?.payment?.checkoutUrl;
        if (checkoutUrl) window.location.assign(checkoutUrl);
      },
    });
  };

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <LoaderCircle className={styles.spinner} size={28} />
          <span>Loading order...</span>
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <Package size={36} />
          <h1>Unable to load order</h1>
          <p>
            {error?.response?.data?.message ||
              error?.message ||
              "The requested order could not be found."}
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
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft size={17} />
          Back to orders
        </button>

        {paymentResult === "success" && (
          <div className={order.payment_status === "PAID" ? styles.successBanner : styles.paymentNotice} role="status">
            <strong>{order.payment_status === "PAID" ? "Payment confirmed" : "Payment confirmation in progress"}</strong>
            <p>
              {order.payment_status === "PAID"
                ? "Stripe confirmed your payment. Your order is being prepared."
                : "Stripe has returned you to the store. We are waiting for the server-side payment confirmation; this page does not treat the redirect alone as proof of payment."}
            </p>
            {order.payment_status !== "PAID" && (
              <button type="button" className={styles.refreshPaymentButton} onClick={() => refetch()}>
                Refresh payment status
              </button>
            )}
          </div>
        )}

        {paymentResult === "cancelled" && (
          <div className={styles.error} role="status">
            <strong>Payment not completed</strong>
            <p>Your order is still pending. You can return to secure checkout below to try again.</p>
          </div>
        )}

        {retryPaymentMutation.isError && (
          <div className={styles.error} role="alert">
            {retryPaymentMutation.error?.response?.data?.message || retryPaymentMutation.error?.message || "Unable to start secure payment. Please try again."}
          </div>
        )}

        {justCreated && (
          <div className={styles.successBanner}>
            <strong>Order placed successfully</strong>
            <p>
              Your order <b>{order.order_number}</b> has been created.
              {order.payment_method === "CARD" &&
                " Complete card payment when you are ready."}
            </p>
          </div>
        )}

        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Order details</p>
            <h1>{order.order_number}</h1>
            <div className={styles.meta}>
              <span>
                <CalendarDays size={15} />
                {formatDate(order.placed_at)}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          {canCancel && (
            <button
              type="button"
              className={styles.cancelButton}
              disabled={cancelMutation.isPending}
              onClick={handleCancel}
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel order"}
            </button>
          )}
        </header>

        {cancelMutation.isError && (
          <div className={styles.error}>
            {cancelMutation.error?.response?.data?.message ||
              cancelMutation.error?.message ||
              "Unable to cancel the order."}
          </div>
        )}

        <div className={styles.grid}>
          <div className={styles.main}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <Package size={19} />
                  <h2>Items</h2>
                </div>
                <span>{order.items_count ?? order.items?.length ?? 0}</span>
              </div>
              <div className={styles.items}>
                {order.items?.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <Truck size={19} />
                  <h2>Shipment</h2>
                </div>
              </div>
              {order.shipments?.length ? (
                <div className={styles.shipments}>
                  {order.shipments.map((shipment) => (
                    <div className={styles.shipment} key={shipment.id}>
                      <div>
                        <span>Status</span>
                        <strong>{shipment.status}</strong>
                      </div>
                      <div>
                        <span>Carrier</span>
                        <strong>{shipment.carrier || "—"}</strong>
                      </div>
                      <div>
                        <span>Tracking number</span>
                        <strong>
                          {shipment.tracking_number || "Not available"}
                        </strong>
                      </div>
                      {shipment.shipped_at && (
                        <div>
                          <span>Shipped</span>
                          <strong>{formatDate(shipment.shipped_at)}</strong>
                        </div>
                      )}
                      {shipment.delivered_at && (
                        <div>
                          <span>Delivered</span>
                          <strong>{formatDate(shipment.delivered_at)}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>
                  Shipment information is not available yet.
                </p>
              )}
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <CreditCard size={19} />
                  <h2>Payment</h2>
                </div>
              </div>
              <div className={styles.payment}>
                <div>
                  <span>Method</span>
                  <strong>{order.payment_method || "—"}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{order.payment_status || "—"}</strong>
                </div>
              </div>
              {order.payment_method === "CARD" && order.payment_status !== "PAID" && order.status === "PENDING" && (
                <button
                  type="button"
                  className={styles.retryPaymentButton}
                  disabled={retryPaymentMutation.isPending}
                  onClick={handleRetryPayment}
                >
                  {retryPaymentMutation.isPending ? "Preparing secure checkout…" : "Continue to secure payment"}
                </button>
              )}
            </section>
          </div>

          <aside className={styles.sidebar}>
            <OrderSummary order={order} />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
