import { Edit3, MapPin, Star, Trash2 } from "lucide-react";

import styles from "./AddressCard.module.css";

const AddressCard = ({
  address,
  selected = false,
  selectable = false,
  onSelect,
  onEdit,
  onDelete,
  disabled = false,
}) => {
  const handleSelect = () => {
    if (!disabled && selectable && onSelect) {
      onSelect(address);
    }
  };

  return (
    <article
      className={`${styles.card} ${
        selected ? styles.selected : ""
      } ${selectable ? styles.selectable : ""}`}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (
          selectable &&
          !disabled &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          handleSelect();
        }
      }}
      role={selectable ? "button" : undefined}
      tabIndex={selectable && !disabled ? 0 : undefined}
      aria-pressed={selectable ? selected : undefined}
      aria-disabled={disabled}
    >
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.icon}>
            <MapPin size={18} />
          </div>

          <div>
            <h3>{address.label || "Address"}</h3>

            {address.is_default && (
              <span className={styles.defaultBadge}>
                <Star size={12} fill="currentColor" />
                Default
              </span>
            )}
          </div>
        </div>

        {selectable && (
          <span
            className={`${styles.radio} ${
              selected ? styles.radioSelected : ""
            }`}
            aria-hidden="true"
          >
            {selected && <span />}
          </span>
        )}
      </div>

      <div className={styles.address}>
        <p>{address.street}</p>

        {address.apartment && <p>{address.apartment}</p>}

        <p>
          {address.city}
          {address.province ? `, ${address.province}` : ""}
          {address.postal_code ? ` ${address.postal_code}` : ""}
        </p>

        <p>
          {address.country}
          {address.country_code ? ` (${address.country_code})` : ""}
        </p>
      </div>

      {(onEdit || onDelete) && (
        <div
          className={styles.actions}
          onClick={(event) => event.stopPropagation()}
        >
          {onEdit && (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => onEdit(address)}
              disabled={disabled}
            >
              <Edit3 size={15} />
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => onDelete(address)}
              disabled={disabled}
            >
              <Trash2 size={15} />
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default AddressCard;
