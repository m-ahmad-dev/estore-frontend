import { CalendarDays, ChevronRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

import OrderStatusBadge from "./OrderStatusBadge";
import styles from "./OrderCard.module.css";

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
  }).format(date);
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.orderIdentity}>
          <div className={styles.icon}>
            <Package size={18} />
          </div>

          <div>
            <p className={styles.label}>Order</p>
            <h2>{order.order_number}</h2>
          </div>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      <div className={styles.info}>
        <div>
          <span className={styles.infoLabel}>Placed</span>

          <span className={styles.infoValue}>
            <CalendarDays size={15} />
            {formatDate(order.placed_at)}
          </span>
        </div>

        <div>
          <span className={styles.infoLabel}>Items</span>
          <span className={styles.infoValue}>{order.items_count ?? 0}</span>
        </div>

        <div>
          <span className={styles.infoLabel}>Payment</span>
          <span className={styles.infoValue}>
            {order.payment_status || "—"}
          </span>
        </div>

        <div>
          <span className={styles.infoLabel}>Total</span>
          <span className={styles.infoValue}>
            {formatCurrency(order.total_amount)}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.paymentStatus}>
          Payment: {order.payment_status || "—"}
        </span>

        <button
          type="button"
          className={styles.detailsButton}
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          View order
          <ChevronRight size={17} />
        </button>
      </div>
    </article>
  );
};

export default OrderCard;
