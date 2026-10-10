import { useState } from "react";

import useApplyCoupon from "../hooks/useApplyCoupon";
import useRemoveCoupon from "../hooks/useRemoveCoupon";
import { getCartErrorMessage } from "../utils/cartError";

import styles from "./CouponForm.module.css";

const CouponForm = ({ coupon }) => {
  const [code, setCode] = useState("");

  const applyMutation = useApplyCoupon();
  const removeMutation = useRemoveCoupon();

  const isPending =
    applyMutation.isPending || removeMutation.isPending;

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode || isPending) {
      return;
    }

    applyMutation.mutate(normalizedCode, {
      onSuccess: () => {
        setCode("");
      },
    });
  };

  const handleRemove = () => {
    if (isPending) {
      return;
    }

    removeMutation.mutate();
  };

  return (
    <section className={styles.wrapper}>
      <h2>Coupon</h2>

      {coupon ? (
        <div className={styles.applied}>
          <div>
            <span className={styles.label}>Applied coupon</span>
            <strong>{coupon.code}</strong>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
          >
            {removeMutation.isPending ? "Removing..." : "Remove"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Coupon code"
            maxLength={50}
            disabled={isPending}
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={!code.trim() || isPending}
          >
            {applyMutation.isPending ? "Applying..." : "Apply"}
          </button>
        </form>
      )}

      {applyMutation.isError && (
        <p className={styles.error}>
          {getCartErrorMessage(
            applyMutation.error,
            "Unable to apply coupon.",
          )}
        </p>
      )}

      {removeMutation.isError && (
        <p className={styles.error}>
          {getCartErrorMessage(
            removeMutation.error,
            "Unable to remove coupon.",
          )}
        </p>
      )}
    </section>
  );
};

export default CouponForm;