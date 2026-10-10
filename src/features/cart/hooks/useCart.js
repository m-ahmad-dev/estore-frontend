import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { selectAuthStatus } from "../../auth/authSelectors";
import { getCart } from "../services/cartApi";

export const cartQueryKey = (authStatus) => [
  "cart",
  authStatus === "authenticated" ? "customer" : "guest",
];

const useCart = () => {
  const authStatus = useSelector(selectAuthStatus);

  return useQuery({
    queryKey: cartQueryKey(authStatus),
    queryFn: getCart,
    staleTime: 1000 * 60,
  });
};

export default useCart;
