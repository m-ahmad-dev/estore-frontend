import styles from "./CartSummary.module.css";
import { getCartPricing, formatCurrency } from "../utils/cartPricing";
import { useNavigate } from "react-router-dom";

const CartSummary = ({ cart }) => {
  const navigate = useNavigate();

  const pricing = getCartPricing(cart);

  const handleCheckout = () => {
    if (!cart?.items?.length) {
      return;
    }

    navigate("/checkout");
  };

  return (
    <aside className={styles.summary}>
      <h2>Order Summary</h2>

      <div className={styles.rows}>
        <div>
          <span>Subtotal</span>
          <strong>{formatCurrency(pricing.subtotal)}</strong>
        </div>

        <div>
          <span>Discount</span>
          <strong>
            {pricing.discount > 0
              ? `- ${formatCurrency(pricing.discount)}`
              : formatCurrency(0)}
          </strong>
        </div>

        <div>
          <span>Shipping</span>
          <strong>
            {pricing.shipping > 0
              ? formatCurrency(pricing.shipping)
              : "Calculated at checkout"}
          </strong>
        </div>
      </div>

      <div className={styles.total}>
        <span>Total</span>
        <strong>{formatCurrency(pricing.total)}</strong>
      </div>

      <button
        type="button"
        className={styles.checkoutButton}
        onClick={handleCheckout}
        disabled={!cart?.items?.length}
      >
        Proceed to checkout
      </button>

      <p className={styles.note}>
        Checkout will validate current stock and pricing before the order is
        placed.
      </p>
    </aside>
  );
};

export default CartSummary;
