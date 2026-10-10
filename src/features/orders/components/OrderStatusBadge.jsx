import styles from "./OrderStatusBadge.module.css";

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const OrderStatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "").toUpperCase();

  return (
    <span
      className={`${styles.badge} ${
        styles[normalizedStatus] || styles.default
      }`}
    >
      {STATUS_LABELS[normalizedStatus] || status || "Unknown"}
    </span>
  );
};

export default OrderStatusBadge;
