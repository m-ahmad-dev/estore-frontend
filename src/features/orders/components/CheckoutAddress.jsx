// src/features/orders/components/CheckoutAddress.jsx
import {
  AlertCircle,
  Check,
  LoaderCircle,
  MapPin,
  Plus,
  RefreshCw,
} from "lucide-react";
import styles from "./CheckoutAddress.module.css";

const CheckoutAddress = ({
  addresses,
  selectedAddressId,
  onSelect,
  onAddAddress,
  disabled = false,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <div className={styles.step}>01</div>
          <div>
            <span>Delivery</span>
            <h2>Shipping address</h2>
            <p>Select where you want your order delivered.</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onAddAddress}
          disabled={disabled}
        >
          <Plus size={16} />
          Add address
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <LoaderCircle size={20} className={styles.spinner} />
          <span>Loading your saved addresses...</span>
        </div>
      ) : isError ? (
        <div className={styles.error}>
          <AlertCircle size={21} />
          <div>
            <strong>Unable to load addresses</strong>
            <p>We could not retrieve your saved delivery addresses.</p>
          </div>
          <button type="button" onClick={onRetry}>
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      ) : !addresses?.length ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <MapPin size={23} />
          </div>
          <div>
            <h3>No saved address</h3>
            <p>
              Add a delivery address from your profile before placing this
              order.
            </p>
          </div>
          <button
            type="button"
            className={styles.addButton}
            onClick={onAddAddress}
            disabled={disabled}
          >
            <Plus size={17} />
            Add address
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {addresses.map((address) => {
            const selected = address.id === selectedAddressId;
            return (
              <button
                key={address.id}
                type="button"
                className={`${styles.card} ${selected ? styles.selected : ""}`}
                onClick={() => onSelect(address.id)}
                disabled={disabled}
                aria-pressed={selected}
              >
                <div
                  className={`${styles.cardIcon} ${
                    selected ? styles.cardIconSelected : ""
                  }`}
                >
                  {selected ? <Check size={17} /> : <MapPin size={17} />}
                </div>
                <div className={styles.content}>
                  <div className={styles.cardTop}>
                    <strong>{address.label || "Delivery address"}</strong>
                    {address.is_default && (
                      <span className={styles.defaultBadge}>Default</span>
                    )}
                  </div>
                  <p>{address.street}</p>
                  <p>
                    {address.city}
                    {address.province ? `, ${address.province}` : ""}
                  </p>
                  <p>
                    {address.country}
                    {address.postal_code ? `, ${address.postal_code}` : ""}
                  </p>
                </div>
                <span
                  className={`${styles.radio} ${
                    selected ? styles.radioSelected : ""
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CheckoutAddress;
