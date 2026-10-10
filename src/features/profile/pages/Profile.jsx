import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Package,
  Heart,
  MessageSquare,
  LogOut,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import { selectCurrentUser } from "../../auth/authSelectors";
import useLogout from "../../auth/hooks/useLogout";
import useUpdateProfile from "../hooks/useUpdateProfile";
import useDeleteAccount from "../hooks/useDeleteAccount";
import useCountries from "../../countries/hooks/useCountries";

import ProfileForm from "../components/ProfileForm";
import AddressList from "../../address/components/AddressList";
import MyReviewsList from "../../reviews/components/MyReviewsList";
import styles from "./Profile.module.css";
import IsDark from "../../../utils/themeUtility/isDark.jsx";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "orders", label: "Orders", icon: Package, route: "/orders" },
  { id: "wishlist", label: "Wishlist", icon: Heart, route: "/wishlist" },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
];

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const isDark = IsDark();
  const [activeTab, setActiveTab] = useState("profile");

  const logoutMutation = useLogout();
  const updateMutation = useUpdateProfile();
  const deleteMutation = useDeleteAccount();

  const { data: countriesData } = useCountries();
  const countries = countriesData?.countries ?? [];

  const handleUpdateProfile = (values) => {
    const payload = {};
    if (values.firstname !== undefined && values.firstname !== "") {
      payload.firstname = values.firstname;
    }
    if (values.lastname !== undefined && values.lastname !== "") {
      payload.lastname = values.lastname;
    }
    if (values.email !== undefined && values.email !== "") {
      payload.email = values.email;
    }
    if (values.phone !== undefined) {
      payload.phone = values.phone || null;
    }
    updateMutation.mutate(payload);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "This will permanently delete your account and all related data. This action cannot be undone. Continue?",
    );
    if (!confirmed) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => navigate("/"),
    });
  };

  const handleTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route);
      return;
    }
    setActiveTab(tab.id);
  };

  const displayName =
    [
      user?.first_name || user?.firstname || "",
      user?.last_name || user?.lastname || "",
    ]
      .join(" ")
      .trim() || "Customer";

  const initial = (user?.first_name || user?.firstname || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <main className={`${styles.page} ${isDark ? styles.dark : ""}`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Account</p>
            <h1>My Account</h1>
            <p className={styles.subtitle}>
              Manage your profile, addresses, orders and reviews.
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.avatar}>{initial}</div>
              <div className={styles.userMeta}>
                <strong>{displayName}</strong>
                <p>{user?.email}</p>
              </div>
            </div>

            <nav className={styles.nav} aria-label="Account navigation">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = !tab.route && activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`${styles.navItem} ${
                      isActive ? styles.navActive : ""
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className={styles.sidebarActions}>
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut size={17} />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className={styles.content}>
            {activeTab === "profile" && (
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Personal information</h2>
                  <p>Update your name, email and phone number.</p>
                </div>

                <ProfileForm
                  user={user}
                  onSubmit={handleUpdateProfile}
                  isSubmitting={updateMutation.isPending}
                />

                {updateMutation.isSuccess && (
                  <p className={styles.success}>
                    Profile updated successfully.
                  </p>
                )}
                {updateMutation.isError && (
                  <p className={styles.errorMsg}>
                    {updateMutation.error?.response?.data?.message ||
                      "Unable to update profile."}
                  </p>
                )}

                <div className={styles.dangerZone}>
                  <h3>Danger zone</h3>
                  <p>
                    Permanently delete your account and all associated data
                    (orders, addresses, reviews, wishlist).
                  </p>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={handleDeleteAccount}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <LoaderCircle size={16} className={styles.spinner} />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete account
                      </>
                    )}
                  </button>
                  {deleteMutation.isError && (
                    <p className={styles.errorMsg}>
                      {deleteMutation.error?.response?.data?.message ||
                        "Unable to delete account."}
                    </p>
                  )}
                </div>
              </section>
            )}

            {activeTab === "addresses" && (
              <section className={styles.panel}>
                <AddressList countries={countries} />
              </section>
            )}

            {activeTab === "reviews" && (
              <section className={styles.panel}>
                <MyReviewsList />
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
