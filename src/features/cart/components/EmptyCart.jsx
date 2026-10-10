import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "./EmptyCart.module.css";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.empty}>
      <div className={styles.icon}>
        <ShoppingCart size={34} />
      </div>
      <h1>Your cart is empty</h1>
      <p>Add products to your cart and they will appear here.</p>
      <button type="button" onClick={() => navigate("/products")}>
        Continue shopping
      </button>
    </div>
  );
};

export default EmptyCart;
