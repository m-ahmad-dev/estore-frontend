import { Banknote, CreditCard } from "lucide-react";
import styles from "./CheckoutPayment.module.css";

const CheckoutPayment = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isSubmitting = false,
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.step}>02</div>

        <div>
          <span>Payment</span>
          <h2>Payment method</h2>
          <p>Select your preferred payment method.</p>
        </div>
      </div>

      <div className={styles.options}>
        <PaymentOption
          value="CASH_ON_DELIVERY"
          selected={value}
          onChange={onChange}
          disabled={disabled}
          icon={<Banknote size={21} />}
          title="Cash on delivery"
          description="Pay when your order arrives."
        />

        <PaymentOption
          value="CARD"
          selected={value}
          onChange={onChange}
          disabled={disabled}
          icon={<CreditCard size={21} />}
          title="Card"
          description="Pay securely by card through Stripe."
        />
      </div>

      <button
        type="button"
        className={styles.submit}
        disabled={disabled || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting
          ? "Processing..."
          : value === "CARD"
            ? "Continue to secure payment"
            : "Place order"}
      </button>
    </section>
  );
};

const PaymentOption = ({
  value,
  selected,
  onChange,
  disabled,
  icon,
  title,
  description,
}) => {
  const active = selected === value;

  return (
    <label
      className={`${styles.option} ${
        active ? styles.selected : ""
      } ${disabled ? styles.disabled : ""}`}
    >
      <input
        type="radio"
        name="authenticated_payment_method"
        value={value}
        checked={active}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />

      <span className={styles.icon}>{icon}</span>

      <span className={styles.content}>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      <span className={styles.radio} />
    </label>
  );
};

export default CheckoutPayment;
