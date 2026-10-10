import styles from "./OrderItem.module.css";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
};

const OrderItem = ({ item }) => {
  return (
    <div className={styles.item}>
      <div className={styles.details}>
        <h3>{item.product_name}</h3>

        <p>SKU: {item.sku || "—"}</p>

        <p>Quantity: {item.quantity}</p>
      </div>

      <div className={styles.pricing}>
        <span>{formatCurrency(item.unit_price)} each</span>

        <strong>{formatCurrency(item.total_price)}</strong>
      </div>
    </div>
  );
};

export default OrderItem;
