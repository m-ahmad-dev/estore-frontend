import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import IsDark from "../../../../utils/themeUtility/isDark";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const isDark = IsDark();
  const navigate = useNavigate();

  return (
    <section
      className={`${styles.hero} ${isDark ? styles.dark : styles.light}`}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>E-STORE COLLECTION</span>

          <h1 className={styles.title}>
            Everything you need,
            <span> all in one place.</span>
          </h1>

          <p className={styles.description}>
            Discover a curated collection of fashion, electronics, accessories,
            and everyday essentials designed for your lifestyle.
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => navigate("/products")}
            >
              Shop Now
              <ArrowRight className={styles.buttonIcon} />
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Categories
            </button>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.visualCard}>
            <div className={styles.visualShape} />
            <div className={styles.visualContent}>
              <span>NEW COLLECTION</span>
              <strong>
                Discover
                <br />
                something new.
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
