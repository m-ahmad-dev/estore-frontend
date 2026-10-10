import { createBrowserRouter } from "react-router-dom";

import Rootlayout from "../layouts/Rootlayout";
import ThemeProvider from "../contexts/ThemeProvider";
import Home from "../features/home/pages/Home.jsx";
import NotFound from "../pages/404/NotFound";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register.jsx";
import Profile from "../features/profile/pages/Profile";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import PublicOnlyRoute from "../features/auth/components/PublicRoute";
import OAuthCallback from "../features/auth/pages/OAuthCallback.jsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.jsx";
import ResetPassword from "../features/auth/pages/ResetPassword.jsx";
import Products from "../features/products/pages/Products.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import Orders from "../features/orders/pages/Orders.jsx";
import OrderDetails from "../features/orders/pages/OrderDetails.jsx";
import Checkout from "../features/orders/pages/Checkout.jsx";
import OrderLookup from "../features/orders/pages/OrderLookup.jsx";
import Wishlist from "../features/wishlist/pages/Wishlist.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider>
        <Rootlayout />
      </ThemeProvider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "categories/:slug",
        element: <Products />,
      },
      {
        path: "products/:slug",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "orders/track",
        element: <OrderLookup />,
      },

      // Authenticated customer pages
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "account",
            element: <Profile />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "orders/:id",
            element: <OrderDetails />,
          },
          {
            path: "wishlist",
            element: <Wishlist />,
          },
        ],
      },
    ],
  },
  // Guest-only authentication pages
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/register",
        element: <Register />,
      },
      {
        path: "auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "auth/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "auth/callback",
        element: <OAuthCallback />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <ThemeProvider>
        <NotFound />
      </ThemeProvider>
    ),
  },
]);

export default router;
