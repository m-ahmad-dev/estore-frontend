import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Heart, Search, ShoppingCart } from "lucide-react";

import Logo from "../logo/Logo.jsx";
import IsDark from "../../utils/themeUtilty/isDark";
import { selectIsAuthenticated } from "../../features/auth/authSelectors";
import useCart from "../../features/cart/hooks/useCart";
import useWishlist from "../../features/wishlist/hooks/useWishlist";
import styles from "./Header.module.css";

const Header = () => {
  const isDark = IsDark();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data } = useCart();
  const cartCount = data?.cart?.items_count ?? 0;

  const { data: wishlistData } = useWishlist();
  const wishlistCount =
    wishlistData?.pages?.[0]?.data?.pagination?.totalItems ?? 0;

  const headerBgClass = isDark
    ? "bg-zinc-900 text-zinc-100 border-zinc-800"
    : "bg-white text-zinc-800 border-zinc-200";

  const bannerBgClass = isDark
    ? "bg-zinc-800 text-zinc-300"
    : "bg-zinc-900 text-zinc-100";

  const actionItemHoverClass = isDark
    ? "hover:text-white"
    : "hover:text-zinc-900";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${headerBgClass}`}
    >
      {/* Announcement Banner */}
      <div
        className={`px-4 py-2 text-center text-xs font-medium ${bannerBgClass}`}
      >
        <p>100% Secure delivery without contacting the courier</p>
      </div>

      {/* Main Navigation Bar */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div
            className="shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Logo />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden flex-1 max-w-md sm:block">
            <SearchInput isDark={isDark} />
          </div>

          {/* User Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs font-medium">
            {/* Account */}
            <button
              type="button"
              className={`cursor-pointer flex items-center gap-1.5 transition-colors duration-200 p-1.5 rounded-md ${actionItemHoverClass}`}
              aria-label="Account"
              onClick={() =>
                navigate(isAuthenticated ? "/account" : "/auth/login")
              }
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Account</span>
            </button>

            <span
              className="text-zinc-300 dark:text-zinc-700"
              aria-hidden="true"
            >
              |
            </span>

            {/* Cart with mandatory 0 badge */}
            <button
              type="button"
              className={`cursor-pointer flex items-center gap-1.5 transition-colors duration-200 p-1.5 rounded-md ${actionItemHoverClass}`}
              aria-label={`Cart, ${cartCount} items`}
              onClick={() => navigate("/cart")}
            >
              <div className={styles.iconWithBadge}>
                <ShoppingCart className="w-5 h-5" />
                <span className={styles.cartBadge} aria-hidden="true">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </div>
              <span className="hidden md:inline">Cart</span>
            </button>

            <span
              className="text-zinc-300 dark:text-zinc-700"
              aria-hidden="true"
            >
              |
            </span>

            {/* Wishlist */}
            <button
              type="button"
              className={`cursor-pointer flex items-center gap-1.5 transition-colors duration-200 p-1.5 rounded-md ${actionItemHoverClass}`}
              aria-label={`Wishlist, ${wishlistCount} items`}
              onClick={() => navigate("/wishlist")}
            >
              <div className={styles.iconWithBadge}>
                <Heart className="w-5 h-5" />
                <span className={styles.wishlistBadge} aria-hidden="true">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              </div>

              <span className="hidden md:inline">Wishlist</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 sm:hidden">
          <SearchInput isDark={isDark} />
        </div>
      </nav>
    </header>
  );
};

export default Header;

const SearchInput = ({ isDark }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = search.trim();

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${
          isDark ? "text-zinc-400" : "text-zinc-500"
        }`}
      />
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className={`w-full rounded-full py-2 pl-9 pr-4 text-sm transition-all outline-none border ${
          isDark
            ? "bg-zinc-800 text-zinc-100 placeholder-zinc-400 border-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            : "bg-zinc-100 text-zinc-800 placeholder-zinc-500 border-zinc-200 focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
        }`}
      />
    </form>
  );
};
