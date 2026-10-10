export const getCartErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  if (!error) {
    return fallback;
  }

  const data = error.response?.data;

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const firstError = data.errors[0];

    if (typeof firstError === "string") {
      return firstError;
    }

    if (typeof firstError?.message === "string") {
      return firstError.message;
    }
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
