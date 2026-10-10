import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "../schemas/profileSchema";
import styles from "./ProfileForm.module.css";

const ProfileForm = ({ user, onSubmit, isSubmitting = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.first_name || user.firstname || "",
        lastname: user.last_name || user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="firstname">First name</label>
          <input
            id="firstname"
            {...register("firstname")}
            disabled={isSubmitting}
          />
          {errors.firstname && (
            <p className={styles.error}>{errors.firstname.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="lastname">Last name</label>
          <input
            id="lastname"
            {...register("lastname")}
            disabled={isSubmitting}
          />
          {errors.lastname && (
            <p className={styles.error}>{errors.lastname.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            {...register("phone")}
            placeholder="03001234567"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className={styles.error}>{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submit}
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
