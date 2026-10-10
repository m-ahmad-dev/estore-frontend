import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "./EmptyWishlist.module.css";

const EmptyWishlist = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.empty}>
      <div className={styles.icon}>
        <Heart size={30} />
      </div>
      <h2>Your wishlist is empty</h2>
      <p>Save products you love and come back to them later.</p>
      <button type="button" onClick={() => navigate("/products")}>
        Browse products
      </button>
    </section>
  );
};

export default EmptyWishlist;
