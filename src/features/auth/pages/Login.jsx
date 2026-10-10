import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import useLogin from "../hooks/useLogin";
import { loginSchema } from "../schemas/authSchema";
import GoogleOAuth from "../components/OAuth.jsx";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (formData) => {
    try {
      await loginMutation.mutateAsync(formData);

      const redirectTo = location.state?.from?.pathname || "/account";

      navigate(redirectTo, {
        replace: true,
      });
    } catch {
      // API error is handled through loginMutation.error.
    }
  };

  const apiError =
    loginMutation.error?.response?.data?.message ||
    loginMutation.error?.message ||
    "Unable to sign in. Please check your credentials and try again.";

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Sign in to your account to continue.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className={styles.form}
          >
            {/* API Error */}
            {loginMutation.isError && (
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

            {/* Password */}
            <div className={styles.field}>
              <div className={styles.passwordHeader}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/auth/forgot-password")}
                  className={styles.forgotLink}
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ""
                }`}
                {...register("password")}
              />

              {errors.password && (
                <p id="password-error" className={styles.fieldError}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={styles.submit}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Register link */}
          <div className={styles.footer}>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate("/auth/register", {
                  state: location.state,
                })
              }
              className={styles.footerLink}
            >
              Create one
            </button>
          </div>

          <div className={styles.divider}>
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <GoogleOAuth />
        </div>
      </div>
    </section>
  );
};

export default Login;