import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./HomeCta.module.css";
import IsDark from "../../../../utils/themeUtility/isDark.jsx";

const HomeCta = () => {
  const isDark = IsDark();
  const navigate = useNavigate();

  return (
    <section
      className={`${styles.section} ${
        isDark ? styles.dark : styles.light
      }`}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>E-STORE</span>

          <h2 className={styles.title}>
            Find something you'll love.
          </h2>

          <p className={styles.description}>
            Explore our collection and discover products
            selected for everyday life.
          </p>

          <button
            type="button"
            className={styles.button}
            onClick={() => navigate("/products")}
          >
            Shop all products
            <ArrowRight className={styles.icon} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;