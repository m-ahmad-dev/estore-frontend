import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { setCredentials } from "../authSlice";
import { getCurrentCustomer } from "../services/authApi";
import { CURRENT_CUSTOMER_QUERY_KEY } from "../hooks/useCurrentCustomer";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;

    const completeOAuthLogin = async () => {
      const loginStatus = searchParams.get("login");
      const oauthError = searchParams.get("error");

      if (oauthError || loginStatus !== "success") {
        if (isMounted) {
          navigate("/login?error=oauth_failed", {
            replace: true,
          });
        }

        return;
      }

      try {
        const data = await getCurrentCustomer();

        if (!data?.customer) {
          throw new Error("Customer information was not returned.");
        }

        dispatch(
          setCredentials({
            customer: data.customer,
          }),
        );

        queryClient.setQueryData(CURRENT_CUSTOMER_QUERY_KEY, data);

        if (isMounted) {
          navigate("/account", {
            replace: true,
          });
        }
      } catch {
        if (isMounted) {
          navigate("/login?error=oauth_failed", {
            replace: true,
          });
        }
      }
    };

    completeOAuthLogin();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate, queryClient, searchParams]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div
        className="
          w-full max-w-md
          rounded-2xl
          border border-zinc-200 dark:border-zinc-800
          bg-white dark:bg-zinc-900
          p-8
          text-center
          shadow-sm
        "
      >
        <div
          className="
            mx-auto mb-5
            h-10 w-10
            animate-spin
            rounded-full
            border-4
            border-zinc-200
            border-t-zinc-800
            dark:border-zinc-700
            dark:border-t-zinc-100
          "
        />

        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Signing you in
        </h1>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Please wait while we complete your Google sign-in.
        </p>
      </div>
    </section>
  );
};

export default OAuthCallback;
