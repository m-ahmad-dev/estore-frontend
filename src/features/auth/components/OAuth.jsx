import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    window.location.assign(`${apiBaseUrl}/auth/google`);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="
        flex w-full items-center justify-center gap-3
        rounded-lg border
        border-zinc-300 dark:border-zinc-700
        bg-white dark:bg-zinc-900
        px-4 py-2.5
        text-sm font-medium
        text-zinc-800 dark:text-zinc-100
        transition-colors duration-200
        hover:bg-zinc-50 dark:hover:bg-zinc-800
        focus:outline-none
        focus:ring-2
        focus:ring-zinc-400 dark:focus:ring-zinc-600
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
      aria-label="Continue with Google"
    >
      {isLoading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200" />
      ) : (
        <FcGoogle className="h-5 w-5" />
      )}

      <span>
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </span>
    </button>
  );
};

export default GoogleOAuth;