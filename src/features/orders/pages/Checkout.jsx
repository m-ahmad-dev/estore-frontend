import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../auth/authSelectors";
import useCart from "../../cart/hooks/useCart";
import { getCartPricing, formatCurrency } from "../../cart/utils/cartPricing";
import useAddresses from "../../address/hooks/useAddresses";
import useCreateOrder from "../hooks/useCreateOrder";
import CheckoutAddress from "../components/CheckoutAddress";
import CheckoutGuestForm from "../components/CheckoutGuestForm";
import CheckoutPayment from "../components/CheckoutPayment";
import styles from "./Checkout.module.css";

const Checkout = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartError,
    refetch: refetchCart,
  } = useCart();

  const {
    data: addressData,
    isLoading: addressesLoading,
    isError: addressesError,
    refetch: refetchAddresses,
  } = useAddresses({
    enabled: isAuthenticated,
  });

  const createOrderMutation = useCreateOrder();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [paymentError, setPaymentError] = useState("");

  const cart = cartData?.cart ?? cartData;

  const addresses = useMemo(
    () => addressData?.addresses ?? [],
    [addressData?.addresses],
  );

  const pricing = useMemo(() => getCartPricing(cart), [cart]);

  const effectiveAddressId = useMemo(() => {
    if (!isAuthenticated || !addresses.length) return "";

    const stillExists = addresses.some(
      (address) => address.id === selectedAddressId,
    );

    if (stillExists) {
      return selectedAddressId;
    }

    const defaultAddress =
      addresses.find((address) => address.is_default) ?? addresses[0];

    return defaultAddress?.id ?? "";
  }, [addresses, isAuthenticated, selectedAddressId]);

  const handleAuthenticatedSubmit = () => {
    if (!effectiveAddressId || createOrderMutation.isPending) {
      return;
    }

    setPaymentError("");

    createOrderMutation.mutate(
      {
        address_id: effectiveAddressId,
        payment_method: paymentMethod,
      },
      {
        onSuccess: (result) => handleOrderSuccess(result, paymentMethod),
      },
    );
  };

  const handleGuestSubmit = (payload) => {
    if (createOrderMutation.isPending) {
      return;
    }

    setPaymentError("");

    createOrderMutation.mutate(payload, {
      onSuccess: (result) => handleOrderSuccess(result, payload.payment_method, payload),
    });
  };

  function handleOrderSuccess(result, submittedPaymentMethod, submittedPayload = {}) {
    const order = result?.data?.order;

    if (!order?.id) {
      setPaymentError("Order was created but no order ID was returned.");
      return;
    }

    const checkoutUrl = result?.data?.payment?.checkoutUrl;

    /*
     * CARD
     */
    if (submittedPaymentMethod === "CARD") {
      if (!checkoutUrl) {
        setPaymentError(
          "Order was created, but Stripe payment could not be initialized.",
        );
        return;
      }

      if (!isAuthenticated && submittedPayload.guest_email) {
        try {
          window.sessionStorage.setItem(
            "estore.pendingGuestOrder",
            JSON.stringify({
              email: submittedPayload.guest_email,
              orderNumber: order.order_number,
            }),
          );
        } catch {
          // Storage may be disabled; the tracking form remains available.
        }
      }

      window.location.assign(checkoutUrl);

      return;
    }

    // CASH ON DELIVERY
    if (isAuthenticated) {
      navigate(`/orders/${order.id}`, {
        state: {
          orderCreated: true,
          paymentIntent: null,
          summary: result?.data?.summary ?? null,
        },
      });
    } else {
      navigate("/orders/track", {
        state: {
          orderCreated: true,
          orderNumber: order.order_number,
          email: submittedPayload.guest_email ?? result?.data?.order?.guest_email,
          paymentIntent: null,
          summary: result?.data?.summary ?? null,
        },
      });
    }
  }

  if (cartLoading) {
    return (
      <CheckoutState>
        <LoaderCircle className={styles.spinner} size={28} />
        <span>Loading checkout...</span>
      </CheckoutState>
    );
  }

  if (cartError || !cart) {
    return (
      <CheckoutState>
        <div className={styles.stateIcon}>
          <ShieldCheck size={28} />
        </div>

        <h1>Unable to load checkout</h1>

        <p>
          We could not retrieve your cart. Please check your connection and try
          again.
        </p>

        <div className={styles.stateActions}>
          <button type="button" onClick={() => refetchCart()}>
            Try again
          </button>

          <button
            type="button"
            className={styles.secondaryStateButton}
            onClick={() => navigate("/cart")}
          >
            Return to cart
          </button>
        </div>
      </CheckoutState>
    );
  }

  if (!cart.items?.length) {
    return (
      <CheckoutState>
        <div className={styles.stateIcon}>
          <CheckCircle2 size={28} />
        </div>

        <h1>Your cart is empty</h1>

        <p>Add products to your cart before proceeding to checkout.</p>

        <button type="button" onClick={() => navigate("/products")}>
          Continue shopping
        </button>
      </CheckoutState>
    );
  }

  const mutationError =
    paymentError ||
    createOrderMutation.error?.response?.data?.message ||
    createOrderMutation.error?.message ||
    "Something went wrong while placing your order.";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/cart")}
          disabled={createOrderMutation.isPending}
        >
          <ArrowLeft size={17} />
          Back to cart
        </button>

        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Secure checkout</span>

            <h1>Complete your order</h1>

            <p>
              Review your delivery details and payment method before placing
              your order.
            </p>
          </div>

          <div className={styles.secureBadge}>
            <ShieldCheck size={18} />
            Secure checkout
          </div>
        </header>

        {(createOrderMutation.isError || paymentError) && (
          <div className={styles.errorBanner}>
            <strong>
              {paymentError
                ? "Payment could not be completed"
                : "Unable to place order"}
            </strong>

            <p>{mutationError}</p>
          </div>
        )}

        <div className={styles.layout}>
          <section className={styles.formColumn}>
            {isAuthenticated ? (
              <>
                <CheckoutAddress
                  addresses={addresses}
                  selectedAddressId={effectiveAddressId}
                  onSelect={setSelectedAddressId}
                  onAddAddress={() => navigate("/account")}
                  disabled={createOrderMutation.isPending}
                  isLoading={addressesLoading}
                  isError={addressesError}
                  onRetry={refetchAddresses}
                />

                <CheckoutPayment
                  value={paymentMethod}
                  onChange={(value) => {
                    setPaymentMethod(value);
                    setPaymentError("");
                  }}
                  onSubmit={handleAuthenticatedSubmit}
                  disabled={
                    !effectiveAddressId || createOrderMutation.isPending
                  }
                  isSubmitting={createOrderMutation.isPending}
                />
              </>
            ) : (
              <CheckoutGuestForm
                onSubmit={handleGuestSubmit}
                isSubmitting={createOrderMutation.isPending}
              />
            )}
          </section>

          <aside className={styles.summary}>
            <div className={styles.summaryHeader}>
              <div>
                <span className={styles.summaryEyebrow}>Your order</span>

                <h2>Order summary</h2>
              </div>

              <span className={styles.itemCount}>
                {cart.items_count ?? cart.items?.length ?? 0}{" "}
                {(cart.items_count ?? cart.items?.length) === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className={styles.items}>
              {cart.items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.itemInfo}>
                    <strong>
                      {item.product_name ||
                        item.variant?.product_name ||
                        "Item"}
                    </strong>

                    <span>Qty: {item.quantity}</span>
                  </div>

                  <strong>
                    {formatCurrency(
                      Number(item.total_price ?? item.line_total ?? 0),
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className={styles.pricing}>
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

                <strong className={styles.serverValue}>
                  Calculated at checkout
                </strong>
              </div>
            </div>

            <div className={styles.total}>
              <span>Estimated total</span>

              <strong>{formatCurrency(pricing.total)}</strong>
            </div>

            <div className={styles.trust}>
              <ShieldCheck size={18} />

              <p>
                Final shipping, stock, pricing and discount validation are
                performed securely by the server.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

const CheckoutState = ({ children }) => (
  <main className={styles.statePage}>
    <div className={styles.state}>{children}</div>
  </main>
);

export default Checkout;
