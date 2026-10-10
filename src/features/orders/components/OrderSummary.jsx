import { Package, Tag, Truck } from "lucide-react";

import styles from "./OrderSummary.module.css";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
};

const OrderSummary = ({ order }) => {
  const items = Array.isArray(order?.items) ? order.items : [];

  const subtotal = Number(order?.subtotal || 0);
  const discount = Number(order?.discount_amount || 0);
  const shipping = Number(order?.shipping_cost || 0);
  const total = Number(order?.total_amount || 0);

  return (
    <section className={styles.summary}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleIcon}>
            <Package size={17} />
          </div>

          <div>
            <h2>Order Summary</h2>
            <span>
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className={styles.items}>
          {items.map((item, index) => {
            const quantity = Number(item?.quantity || 0);
            const unitPrice = Number(
              item?.unit_price ?? item?.price ?? item?.unitPrice ?? 0,
            );

            const lineTotal = Number(
              item?.total_price ??
                item?.line_total ??
                item?.total ??
                unitPrice * quantity,
            );

            return (
              <div
                key={item?.id ?? `${item?.product_id}-${index}`}
                className={styles.item}
              >
                <div className={styles.itemInfo}>
                  <strong>
                    {item?.product_name || item?.product?.name || "Product"}
                  </strong>

                  {item?.variant_name && (
                    <span className={styles.variant}>{item.variant_name}</span>
                  )}


                </div>

                <strong className={styles.itemTotal}>
                  {formatCurrency(lineTotal)}
                </strong>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>

        <div className={styles.row}>
          <span className={styles.labelWithIcon}>
            <Tag size={14} />
            Discount
          </span>

          <strong className={discount > 0 ? styles.discount : ""}>
            {discount > 0 ? `- ${formatCurrency(discount)}` : formatCurrency(0)}
          </strong>
        </div>

        <div className={styles.row}>
          <span className={styles.labelWithIcon}>
            <Truck size={14} />
            Shipping
          </span>

          <strong>{shipping > 0 ? formatCurrency(shipping) : "Free"}</strong>
        </div>
      </div>

      <div className={styles.total}>
        <div>
          <span>Total</span>
          <small>Including applicable charges</small>
        </div>

        <strong>{formatCurrency(total)}</strong>
      </div>
    </section>
  );
};

export default OrderSummary;
