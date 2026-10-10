import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import useForgotPassword from "../hooks/useForgotPassword";
import { forgotPasswordSchema } from "../schemas/authSchema";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (formData) => {
    try {
      await forgotPasswordMutation.mutateAsync(formData.email);
    } catch {
      // API error is handled through forgotPasswordMutation.error.
    }
  };

  const apiError =
    forgotPasswordMutation.error?.response?.data?.message ||
    forgotPasswordMutation.error?.message ||
    "Unable to process your request. Please try again.";

  const isSuccess = forgotPasswordMutation.isSuccess;

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Forgot password</h1>
            <p className={styles.subtitle}>
              Enter the email associated with your account and we will send you
              a reset link if an account exists.
            </p>
          </div>

          {isSuccess ? (
            <div className={styles.successBox} role="status">
              <p className={styles.successTitle}>Check your email</p>
              <p className={styles.successText}>
                If an account with that email exists, we have sent a password
                reset link. The link expires in 15 minutes.
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className={styles.submit}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.form}
            >
              {/* API Error */}
              {forgotPasswordMutation.isError && (
                <div role="alert" className={styles.apiError}>
                  {apiError}
                </div>
              )}

              {/* Email */}
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`${styles.input} ${
                    errors.email ? styles.inputError : ""
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className={styles.fieldError}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className={styles.submit}
              >
                {forgotPasswordMutation.isPending
                  ? "Sending..."
                  : "Send reset link"}
              </button>
            </form>
          )}

          {/* Footer */}
          {!isSuccess && (
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

export default ForgotPassword;
