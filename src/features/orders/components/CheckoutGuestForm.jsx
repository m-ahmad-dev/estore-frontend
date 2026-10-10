// src/features/orders/components/CheckoutGuestForm.jsx
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Banknote, CreditCard, LoaderCircle } from "lucide-react";
import { guestOrderSchema } from "../schemas/orderSchema";
import { getValidProvincesForCountry } from "../../../utils/locationOptions.js";
import useCountries from "../../countries/hooks/useCountries";
import styles from "./CheckoutGuestForm.module.css";

const defaultValues = {
  guest_name: "",
  guest_email: "",
  guest_phone: "",
  guest_address: {
    country_code: "",
    province_code: "",
    city: "",
    street: "",
    apartment: "",
    postal_code: "",
  },
  payment_method: "CASH_ON_DELIVERY",
};

const CheckoutGuestForm = ({ onSubmit, isSubmitting = false }) => {
  const {
    data,
    isLoading: countriesLoading,
    isError: countriesError,
    refetch: refetchCountries,
  } = useCountries();

  const countries = data?.countries ?? [];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(guestOrderSchema),
    defaultValues,
    mode: "onBlur",
  });

  const selectedCountryCode = useWatch({
    control,
    name: "guest_address.country_code",
  });

  const provinces = getValidProvincesForCountry(selectedCountryCode);

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    setValue("guest_address.country_code", countryCode, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("guest_address.province_code", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <form
      id="guest-checkout-form"
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <section className={styles.section}>
        <SectionHeader
          number="01"
          title="Contact information"
          description="We will use these details to send your order updates."
        />
        <div className={styles.grid}>
          <Field label="Full name" required error={errors.guest_name?.message}>
            <input
              {...register("guest_name")}
              placeholder="Ali Khan"
              autoComplete="name"
              disabled={isSubmitting}
            />
          </Field>
          <Field
            label="Email address"
            required
            error={errors.guest_email?.message}
          >
            <input
              {...register("guest_email")}
              type="email"
              placeholder="ali@example.com"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </Field>
          <Field
            label="Phone number"
            required
            error={errors.guest_phone?.message}
            full
          >
            <input
              {...register("guest_phone")}
              type="tel"
              placeholder="+923001234567"
              autoComplete="tel"
              inputMode="tel"
              disabled={isSubmitting}
            />
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader
          number="02"
          title="Shipping address"
          description="Choose your country and province."
        />

        {countriesLoading && (
          <div className={styles.loading}>
            <LoaderCircle size={19} className={styles.spinner} />
            Loading supported countries...
          </div>
        )}

        {countriesError && (
          <div className={styles.errorBox}>
            <AlertCircle size={19} />
            <div>
              <strong>Unable to load countries</strong>
              <p>We could not load the countries supported by the store.</p>
            </div>
            <button type="button" onClick={() => refetchCountries()}>
              Try again
            </button>
          </div>
        )}

        {!countriesLoading && !countriesError && (
          <div className={styles.grid}>
            <Field
              label="Country"
              required
              error={errors.guest_address?.country_code?.message}
            >
              <select
                value={selectedCountryCode ?? ""}
                onChange={handleCountryChange}
                disabled={isSubmitting}
              >
                <option value="">Select country</option>
                {countries.map((country) => {
                  const code = country.code?.iso2;
                  if (!code) return null;
                  return (
                    <option key={code} value={code}>
                      {country.flag_emoji ? `${country.flag_emoji} ` : ""}
                      {country.name}
                    </option>
                  );
                })}
              </select>
            </Field>

            <Field
              label="Province / State"
              required
              error={errors.guest_address?.province_code?.message}
            >
              <select
                {...register("guest_address.province_code")}
                disabled={
                  !selectedCountryCode || provinces.length === 0 || isSubmitting
                }
              >
                <option value="">
                  {!selectedCountryCode
                    ? "Select country first"
                    : provinces.length
                      ? "Select province / state"
                      : "No supported provinces"}
                </option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="City"
              required
              error={errors.guest_address?.city?.message}
            >
              <input
                {...register("guest_address.city")}
                placeholder="Lahore"
                autoComplete="address-level2"
                disabled={isSubmitting}
              />
            </Field>

            <Field
              label="Postal code"
              required
              error={errors.guest_address?.postal_code?.message}
            >
              <input
                {...register("guest_address.postal_code")}
                placeholder="54000"
                inputMode="numeric"
                autoComplete="postal-code"
                disabled={isSubmitting}
              />
            </Field>

            <Field
              label="Street address"
              required
              error={errors.guest_address?.street?.message}
              full
            >
              <input
                {...register("guest_address.street")}
                placeholder="House 12, Street 4"
                autoComplete="street-address"
                disabled={isSubmitting}
              />
            </Field>

            <Field
              label="Apartment / Suite"
              error={errors.guest_address?.apartment?.message}
              full
            >
              <input
                {...register("guest_address.apartment")}
                placeholder="Apartment, floor, unit (optional)"
                autoComplete="address-line2"
                disabled={isSubmitting}
              />
            </Field>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <SectionHeader
          number="03"
          title="Payment method"
          description="Choose how you want to pay for this order."
        />
        <Controller
          name="payment_method"
          control={control}
          render={({ field }) => (
            <div className={styles.paymentOptions}>
              <PaymentOption
                value="CASH_ON_DELIVERY"
                selected={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
                icon={<Banknote size={21} />}
                title="Cash on delivery"
                description="Pay when your order arrives."
              />
              <PaymentOption
                value="CARD"
                selected={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
                icon={<CreditCard size={21} />}
                title="Card"
                description="Pay securely by card after order placement."
              />
            </div>
          )}
        />
      </section>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={
          isSubmitting ||
          countriesLoading ||
          countriesError ||
          !countries.length
        }
      >
        {isSubmitting ? (
          <>
            <LoaderCircle size={18} className={styles.buttonSpinner} />
            Placing order...
          </>
        ) : (
          "Place order"
        )}
      </button>

      <p className={styles.formNote}>
        By placing your order, your information will be securely processed to
        create your order and arrange delivery.
      </p>
    </form>
  );
};

const SectionHeader = ({ number, title, description }) => (
  <div className={styles.sectionHeader}>
    <span className={styles.step}>{number}</span>
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  </div>
);

const Field = ({ label, required, error, children, full }) => (
  <label className={`${styles.field} ${full ? styles.full : ""}`}>
    <span>
      {label} {required && <b>*</b>}
    </span>
    {children}
    {error && <small className={styles.fieldError}>{error}</small>}
  </label>
);

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
      className={`${styles.paymentOption} ${
        active ? styles.paymentSelected : ""
      } ${disabled ? styles.disabled : ""}`}
    >
      <input
        type="radio"
        value={value}
        checked={active}
        onChange={() => onChange(value)}
        disabled={disabled}
      />
      <span className={styles.paymentIcon}>{icon}</span>
      <span className={styles.paymentContent}>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span
        className={`${styles.radio} ${active ? styles.radioSelected : ""}`}
      />
    </label>
  );
};

export default CheckoutGuestForm;
