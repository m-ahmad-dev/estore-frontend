import { useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";

import useAddresses from "../hooks/useAddresses";
import useCreateAddress from "../hooks/useCreateAddress";
import useUpdateAddress from "../hooks/useUpdateAddress";
import useDeleteAddress from "../hooks/useDeleteAddress";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

import styles from "./AddressList.module.css";

const AddressList = ({
  selectable = false,
  selectedAddressId = null,
  onSelect,
  countries = [],
}) => {
  const { data, isLoading, isError, error } = useAddresses();

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addresses = data?.addresses ?? [];

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleCreate = (values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleUpdate = (values) => {
    if (!editingAddress?.id) {
      return;
    }

    updateMutation.mutate(
      {
        id: editingAddress.id,
        data: values,
      },
      {
        onSuccess: () => {
          setEditingAddress(null);
          setShowForm(false);
        },
      },
    );
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = (address) => {
    const confirmed = window.confirm(
      `Delete "${address.label || "this address"}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(address.id);
  };

  const handleCancelForm = () => {
    setEditingAddress(null);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <LoaderCircle size={22} className={styles.spinner} />
        <span>Loading addresses...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorState}>
        <h3>Unable to load addresses</h3>
        <p>
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Delivery addresses</h2>

          <p>
            {selectable
              ? "Select where you want your order delivered."
              : "Manage your saved delivery addresses."}
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className={styles.addButton}
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
          >
            <Plus size={16} />
            Add address
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formWrapper}>
          <AddressForm
            initialAddress={editingAddress}
            countries={countries}
            onSubmit={editingAddress ? handleUpdate : handleCreate}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />

          {(createMutation.isError || updateMutation.isError) && (
            <p className={styles.mutationError}>
              {(createMutation.error || updateMutation.error)?.response?.data
                ?.message || "Unable to save address."}
            </p>
          )}
        </div>
      )}

      {deleteMutation.isError && (
        <div className={styles.mutationError}>
          {deleteMutation.error?.response?.data?.message ||
            "Unable to delete address."}
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className={styles.empty}>
          <h3>No saved addresses</h3>
          <p>Add a delivery address to continue.</p>

          <button type="button" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Add your first address
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selectable={selectable}
              selected={selectedAddressId === address.id}
              onSelect={onSelect}
              onEdit={selectable ? undefined : handleEdit}
              onDelete={selectable ? undefined : handleDelete}
              disabled={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default AddressList;
