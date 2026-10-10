import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import useRegister from "../hooks/useRegister";
import { registerSchema } from "../schemas/authSchema";
import GoogleOAuth from "../components/OAuth.jsx";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phone: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (formData) => {
    try {
      await registerMutation.mutateAsync(formData);

      const redirectTo = location.state?.from?.pathname || "/account";

      navigate(redirectTo, {
        replace: true,
      });
    } catch {
      // API error is handled through registerMutation.error.
    }
  };

  const apiError =
    registerMutation.error?.response?.data?.message ||
    registerMutation.error?.message ||
    "Unable to create your account. Please try again.";

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>
              Enter your details to get started.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className={styles.form}
          >
            {/* API Error */}
            {registerMutation.isError && (
              <div role="alert" className={styles.apiError}>
                {apiError}
              </div>
            )}

            {/* Name row */}
            <div className={styles.nameRow}>
              <div className={styles.field}>
                <label htmlFor="firstname" className={styles.label}>
                  First name
                </label>
                <input
                  id="firstname"
                  type="text"
                  autoComplete="given-name"
                  placeholder="John"
                  aria-invalid={Boolean(errors.firstname)}
                  aria-describedby={
                    errors.firstname ? "firstname-error" : undefined
                  }
                  className={`${styles.input} ${
                    errors.firstname ? styles.inputError : ""
                  }`}
                  {...register("firstname")}
                />
                {errors.firstname && (
                  <p id="firstname-error" className={styles.fieldError}>
                    {errors.firstname.message}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="lastname" className={styles.label}>
                  Last name
                </label>
                <input
                  id="lastname"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  aria-invalid={Boolean(errors.lastname)}
                  aria-describedby={
                    errors.lastname ? "lastname-error" : undefined
                  }
                  className={`${styles.input} ${
                    errors.lastname ? styles.inputError : ""
                  }`}
                  {...register("lastname")}
                />
                {errors.lastname && (
                  <p id="lastname-error" className={styles.fieldError}>
                    {errors.lastname.message}
                  </p>
                )}
              </div>
            </div>

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

            {/* Phone (optional) */}
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                Phone <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="3001234567"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={`${styles.input} ${
                  errors.phone ? styles.inputError : ""
                }`}
                {...register("phone")}
              />
              {errors.phone && (
                <p id="phone-error" className={styles.fieldError}>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
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
              disabled={registerMutation.isPending}
              className={styles.submit}
            >
              {registerMutation.isPending
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          {/* Login link */}
          <div className={styles.footer}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate("/auth/login", {
                  state: location.state,
                })
              }
              className={styles.footerLink}
            >
              Sign in
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

export default Register;
