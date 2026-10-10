// src/features/orders/pages/OrderLookup.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  LoaderCircle,
  Package,
  Search,
} from "lucide-react";
import { orderLookupSchema } from "../schemas/orderSchema";
import useOrderLookup from "../hooks/useOrderLookup";
import { createOrderPaymentSession } from "../services/orderApi";
import OrderItem from "../components/OrderItem";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderSummary from "../components/OrderSummary";
import styles from "./OrderLookup.module.css";

const OrderLookup = () => {
  const location = useLocation();
  const prefill = location.state;
  const searchParams = new URLSearchParams(location.search);
  const paymentResult = searchParams.get("payment");
  const queryOrderNumber = searchParams.get("order_number") ?? "";
  let storedGuestOrder = null;
  try {
    storedGuestOrder = JSON.parse(
      window.sessionStorage.getItem("estore.pendingGuestOrder") ?? "null",
    );
  } catch {
    storedGuestOrder = null;
  }
  const initialEmail = prefill?.email ?? storedGuestOrder?.email ?? "";
  const initialOrderNumber = prefill?.orderNumber || queryOrderNumber || storedGuestOrder?.orderNumber || "";

  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);
  const autoLookedUpRef = useRef(false);

  const lookupMutation = useOrderLookup();
  const retryPaymentMutation = useMutation({ mutationFn: createOrderPaymentSession });

  // 1. Initialize form values directly from location.state on initial render (No useEffect required)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderLookupSchema),
    defaultValues: {
      email: initialEmail,
      order_number: initialOrderNumber,
    },
  });

  // 2. Pure API executor (no synchronous setState calls)
  const executeSearch = useCallback(
    (email, orderNumber) => {
      const payload = {
        email: email.trim(),
        order_number: orderNumber.trim(),
      };

      lookupMutation.mutate(payload, {
        onSuccess: (result) => {
          const fetchedOrder = result?.order ?? result?.data?.order ?? null;
          setOrder(fetchedOrder);
          try {
            const stored = JSON.parse(window.sessionStorage.getItem("estore.pendingGuestOrder") ?? "null");
            if (stored?.orderNumber?.toUpperCase() === payload.order_number.toUpperCase()) {
              window.sessionStorage.removeItem("estore.pendingGuestOrder");
            }
          } catch {
            // Tracking still works if browser storage is disabled or unavailable.
          }
        },
      });
    },
    [lookupMutation],
  );

  // 3. User-initiated form submission handler
  const onSubmit = (values) => {
    setOrder(null);
    executeSearch(values.email, values.order_number);
  };

  // 4. Mount side-effect: Auto-trigger lookup if arriving straight from guest checkout
  useEffect(() => {
    const shouldAutoLookup =
      (prefill?.orderCreated && prefill?.email && prefill?.orderNumber) ||
      (Boolean(paymentResult) && initialEmail && initialOrderNumber);

    if (shouldAutoLookup && !autoLookedUpRef.current) {
      autoLookedUpRef.current = true;
      executeSearch(initialEmail, initialOrderNumber);
    }
  }, [prefill, paymentResult, initialEmail, initialOrderNumber, executeSearch]);

  // 5. Scroll to results when order data updates
  useEffect(() => {
    if (order && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [order]);

  const handleRetryPayment = () => {
    if (!order || retryPaymentMutation.isPending) return;
    retryPaymentMutation.mutate(
      {
        orderId: order.id,
        email: order.customer?.email ?? initialEmail,
        order_number: order.order_number,
      },
      {
        onSuccess: (result) => {
          const checkoutUrl = result?.data?.payment?.checkoutUrl;
          if (checkoutUrl) window.location.assign(checkoutUrl);
        },
      },
    );
  };

  const handleCopyText = async (textToCopy) => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>Guest tracking</span>
          <h1>Track your order</h1>
          <p>
            Enter your email and order number to check order progress and
            status.
          </p>
        </header>

        {paymentResult === "success" && (
          <section className={styles.saveSection} role="status">
            <div className={styles.saveHeader}>
              <div className={styles.successIconWrapper}><CheckCircle2 size={22} /></div>
              <div>
                <h2>Payment confirmation in progress</h2>
                <p>We are checking the server-confirmed payment status. The redirect alone does not confirm payment.</p>
              </div>
            </div>
          </section>
        )}

        {paymentResult === "cancelled" && (
          <div className={styles.errorBox} role="status">
            <AlertCircle size={20} className={styles.errorIcon} />
            <div><strong>Payment not completed</strong><p>Your order remains pending. Look up the order below to continue secure checkout.</p></div>
          </div>
        )}

        {/* Success / Save Order Number Banner */}
        {prefill?.orderCreated && prefill?.orderNumber && (
          <section
            className={styles.saveSection}
            aria-label="Order Placement Confirmation"
          >
            <div className={styles.saveHeader}>
              <div className={styles.successIconWrapper}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h2>Order placed successfully!</h2>
                <p>
                  Save your order reference below to track shipment updates
                  anytime.
                </p>
              </div>
            </div>

            <div className={styles.orderNumberBox}>
              <div className={styles.orderNumberContent}>
                <span className={styles.orderNumberLabel}>Order number</span>
                <strong className={styles.orderNumberValue}>
                  {prefill.orderNumber}
                </strong>
              </div>

              <button
                type="button"
                className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
                onClick={() => handleCopyText(prefill.orderNumber)}
                aria-label="Copy order number"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* Lookup Form */}
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.field}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={lookupMutation.isPending}
              {...register("email")}
            />
            {errors.email && (
              <small id="email-error" className={styles.error} role="alert">
                <AlertCircle size={14} />
                {errors.email.message}
              </small>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="order_number">Order number</label>
            <input
              id="order_number"
              type="text"
              autoComplete="off"
              placeholder="e.g. ORD-8291-9012"
              aria-invalid={Boolean(errors.order_number)}
              aria-describedby={
                errors.order_number ? "order-number-error" : undefined
              }
              disabled={lookupMutation.isPending}
              {...register("order_number")}
            />
            {errors.order_number && (
              <small
                id="order-number-error"
                className={styles.error}
                role="alert"
              >
                <AlertCircle size={14} />
                {errors.order_number.message}
              </small>
            )}
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={lookupMutation.isPending}
          >
            {lookupMutation.isPending ? (
              <>
                <LoaderCircle size={18} className={styles.spinner} />
                Searching...
              </>
            ) : (
              <>
                <Search size={18} />
                Find order
              </>
            )}
          </button>
        </form>

        {/* Error Feedback */}
        {lookupMutation.isError && (
          <div className={styles.errorBox} role="alert" aria-live="assertive">
            <AlertCircle size={20} className={styles.errorIcon} />
            <div>
              <strong>Unable to locate order</strong>
              <p>
                {lookupMutation.error?.response?.data?.message ||
                  lookupMutation.error?.message ||
                  "Please verify your email and order number and try again."}
              </p>
            </div>
          </div>
        )}

        {/* Order Results */}
        {order && (
          <div ref={resultRef} className={styles.result}>
            <div className={styles.resultHeader}>
              <div className={styles.resultTitle}>
                <Package size={22} />
                <h2>Order #{order.order_number}</h2>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className={styles.items}>
              {order.items?.map((item) => (
                <OrderItem key={item.id || item._id} item={item} />
              ))}
            </div>

            <OrderSummary order={order} />
            {order.payment_method === "CARD" && order.payment_status !== "PAID" && order.status === "PENDING" && (
              <div className={styles.retryPayment}>
                <p>Card payment is still pending. Continue to Stripe to complete or retry payment.</p>
                {retryPaymentMutation.isError && (
                  <p className={styles.retryPaymentError} role="alert">
                    {retryPaymentMutation.error?.response?.data?.message || retryPaymentMutation.error?.message || "Unable to start secure payment."}
                  </p>
                )}
                <button type="button" onClick={handleRetryPayment} disabled={retryPaymentMutation.isPending}>
                  {retryPaymentMutation.isPending ? "Preparing secure checkout…" : "Continue to secure payment"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderLookup;
