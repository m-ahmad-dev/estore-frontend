import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../schemas/addressSchema.js";
import { getValidProvincesForCountry } from "../../../utils/locationOptions.js";
import styles from "./AddressForm.module.css";

const DEFAULT_VALUES = {
  label: "",
  street: "",
  city: "",
  province: "",
  province_code: "",
  country: "",
  country_code: "",
  postal_code: "",
  is_default: false,
};

const AddressForm = ({
  initialAddress = null,
  countries = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(initialAddress);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const countryCode = useWatch({ control, name: "country_code" });

  const provinces = useMemo(
    () => getValidProvincesForCountry(countryCode || ""),
    [countryCode],
  );

  // Reset form when editing / switching addresses
  useEffect(() => {
    if (initialAddress) {
      reset({
        label: initialAddress.label ?? "",
        street: initialAddress.street ?? "",
        city: initialAddress.city ?? "",
        province: initialAddress.province ?? "",
        province_code: initialAddress.province_code ?? "",
        country: initialAddress.country ?? "",
        country_code: initialAddress.country_code ?? "",
        postal_code: initialAddress.postal_code ?? "",
        is_default: initialAddress.is_default ?? false,
      });
      return;
    }
    reset(DEFAULT_VALUES);
  }, [initialAddress, reset]);

  // When country changes, clear province if it no longer belongs to the new country
  useEffect(() => {
    if (!countryCode) {
      setValue("province", "", { shouldValidate: false });
      setValue("province_code", "", { shouldValidate: false });
      return;
    }
  }, [countryCode, setValue]);

  const handleCountryChange = (event) => {
    const code = event.target.value;
    setValue("country_code", code, { shouldValidate: true });

    const selected = countries.find((c) => c.code?.iso2 === code);
    setValue("country", selected?.name ?? "", { shouldValidate: true });

    // Clear province when country changes
    setValue("province", "", { shouldValidate: false });
    setValue("province_code", "", { shouldValidate: false });
  };

  const handleProvinceChange = (event) => {
    const code = event.target.value;
    const selected = provinces.find((p) => p.code === code);

    setValue("province_code", code, { shouldValidate: true });
    setValue("province", selected?.name ?? "", { shouldValidate: true });
  };

  const submit = (values) => {
    // values already contain the correct names + codes for the backend
    onSubmit(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.heading}>
        <div>
          <h2>{isEditing ? "Edit address" : "Add new address"}</h2>
          <p>
            {isEditing
              ? "Update your saved delivery address."
              : "Add an address for faster checkout."}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <Field label="Label" error={errors.label?.message} optional>
          <input
            {...register("label")}
            type="text"
            placeholder="Home, Office..."
            disabled={isSubmitting}
          />
        </Field>

        <Field label="Street address" error={errors.street?.message}>
          <input
            {...register("street")}
            type="text"
            placeholder="House, street, area"
            disabled={isSubmitting}
          />
        </Field>

        <Field label="City" error={errors.city?.message}>
          <input
            {...register("city")}
            type="text"
            placeholder="Lahore"
            disabled={isSubmitting}
          />
        </Field>

        {/* Country – select only */}
        <Field
          label="Country"
          error={errors.country_code?.message || errors.country?.message}
        >
          <select
            {...register("country_code")}
            onChange={handleCountryChange}
            disabled={isSubmitting || countries.length === 0}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.code?.iso2}>
                {country.flag_emoji ? `${country.flag_emoji} ` : ""}
                {country.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Province – select only, depends on country */}
        <Field
          label="Province / State"
          error={errors.province_code?.message || errors.province?.message}
        >
          <select
            {...register("province_code")}
            onChange={handleProvinceChange}
            disabled={isSubmitting || !countryCode || provinces.length === 0}
          >
            <option value="">
              {!countryCode
                ? "Select country first"
                : provinces.length === 0
                  ? "No provinces available"
                  : "Select province"}
            </option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Postal code" error={errors.postal_code?.message}>
          <input
            {...register("postal_code")}
            type="text"
            placeholder="54000"
            disabled={isSubmitting}
          />
        </Field>
      </div>

      <label className={styles.checkbox}>
        <input
          {...register("is_default")}
          type="checkbox"
          disabled={isSubmitting}
        />
        <span>Make this my default address</span>
      </label>

      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update address"
              : "Save address"}
        </button>
      </div>
    </form>
  );
};

const Field = ({ label, error, optional = false, children }) => (
  <div className={styles.field}>
    <label>
      <span>{label}</span>
      {optional && <small>Optional</small>}
    </label>
    {children}
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

export default AddressForm;
