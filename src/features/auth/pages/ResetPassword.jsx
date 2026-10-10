import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import useResetPassword from "../hooks/useResetPassword";
import { resetPasswordSchema } from "../schemas/authSchema";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (formData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token: formData.token,
        newPassword: formData.newPassword,
      });
    } catch {
      // API error is handled through resetPasswordMutation.error.
    }
  };

  const apiError =
    resetPasswordMutation.error?.response?.data?.message ||
    resetPasswordMutation.error?.message ||
    "Unable to reset password. Please try again.";

  const isSuccess = resetPasswordMutation.isSuccess;
  const hasToken = Boolean(tokenFromUrl);

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Reset password</h1>
            <p className={styles.subtitle}>
              {hasToken
                ? "Enter a new password for your account."
                : "A valid reset token is required to continue."}
            </p>
          </div>

          {!hasToken ? (
            <div className={styles.warningBox} role="alert">
              <p className={styles.warningText}>
                This reset link is invalid or incomplete. Please request a new
                password reset link.
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth/forgot-password")}
                className={styles.submit}
              >
                Request new link
              </button>
            </div>
          ) : isSuccess ? (
            <div className={styles.successBox} role="status">
              <p className={styles.successTitle}>Password updated</p>
              <p className={styles.successText}>
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className={styles.submit}
              >
                Sign in
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.form}
            >
              {/* Hidden token field */}
              <input type="hidden" {...register("token")} />

              {/* API Error */}
              {resetPasswordMutation.isError && (
                <div role="alert" className={styles.apiError}>
                  {apiError}
                </div>
              )}

              {/* New Password */}
              <div className={styles.field}>
                <label htmlFor="newPassword" className={styles.label}>
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  aria-invalid={Boolean(errors.newPassword)}
                  aria-describedby={
                    errors.newPassword ? "newPassword-error" : undefined
                  }
                  className={`${styles.input} ${
                    errors.newPassword ? styles.inputError : ""
                  }`}
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p id="newPassword-error" className={styles.fieldError}>
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword ? "confirmPassword-error" : undefined
                  }
                  className={`${styles.input} ${
                    errors.confirmPassword ? styles.inputError : ""
                  }`}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className={styles.fieldError}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className={styles.submit}
              >
                {resetPasswordMutation.isPending
                  ? "Updating password..."
                  : "Reset password"}
              </button>
            </form>
          )}

          {/* Footer */}
          {!isSuccess && hasToken && (
            <div className={styles.footer}>
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className={styles.footerLink}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
