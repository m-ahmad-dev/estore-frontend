import { ArrowLeft, LoaderCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useCart from "../hooks/useCart";
import useClearCart from "../hooks/useClearCart";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import CouponForm from "../components/CouponForm";
import EmptyCart from "../components/EmptyCart";
import { getCartErrorMessage } from "../utils/cartError";

import styles from "./Cart.module.css";

const Cart = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useCart();
  const clearMutation = useClearCart();

  const cart = data?.cart;

  const handleClearCart = () => {
    if (!cart?.items?.length || clearMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?",
    );

    if (!confirmed) {
      return;
    }

    clearMutation.mutate();
  };

  if (isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <LoaderCircle className={styles.spinner} size={28} />
          <span>Loading cart...</span>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>
          <h1>Unable to load cart</h1>

          <p>{getCartErrorMessage(error)}</p>

          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!cart || cart.items_count === 0) {
    return (
      <main className={styles.page}>
        <EmptyCart />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/products")}
        >
          <ArrowLeft size={17} />
          Continue shopping
        </button>

        <div className={styles.headingRow}>
          <div>
            <h1>Your Cart</h1>
            <p>
              {cart.items_count} {cart.items_count === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearCart}
            disabled={clearMutation.isPending}
          >
            <Trash2 size={17} />

            {clearMutation.isPending ? "Clearing..." : "Clear cart"}
          </button>
        </div>

        {clearMutation.isError && (
          <div className={styles.mutationError}>
            {getCartErrorMessage(clearMutation.error)}
          </div>
        )}

        <div className={styles.layout}>
          <section className={styles.itemsSection}>
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <CouponForm coupon={cart.coupon} />
          </section>

          <CartSummary cart={cart} />
        </div>
      </div>
    </main>
  );
};

export default Cart;
