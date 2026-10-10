import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductSection.module.css";
import IsDark from "../../../../utils/themeUtility/isDark.jsx";

const ProductSection = ({ products = [], isLoading, isError }) => {
  const isDark = IsDark();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section
        className={`${styles.section} ${isDark ? styles.dark : styles.light}`}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <span className={styles.eyebrow}>COLLECTION</span>
              <h2 className={styles.title}>Explore our products</h2>
            </div>
          </div>

          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonSmallLine} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        className={`${styles.section} ${isDark ? styles.dark : styles.light}`}
      >
        <div className={styles.container}>
          <div className={styles.error}>Unable to load products.</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.section} ${isDark ? styles.dark : styles.light}`}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>COLLECTION</span>

            <h2 className={styles.title}>Explore our products</h2>

            <p className={styles.description}>
              Browse our latest collection across different categories.
            </p>
          </div>

          <button
            type="button"
            className={styles.viewAll}
            onClick={() => navigate("/products")}
          >
            View all
            <ArrowRight className={styles.icon} />
          </button>
        </div>

        {products.length === 0 ? (
          <div className={styles.empty}>
            No products are currently available.
          </div>
        ) : (
          <div className={styles.grid}>
            {products.slice(0, 8).map((product) => (
              <article
                key={product.id}
                className={styles.card}
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={
                      product.images?.find((image) => image.is_primary)?.url ||
                      product.images?.[0]?.url
                    }
                    alt={product.name}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>

                <div className={styles.cardContent}>
                  <span className={styles.category}>
                    {product.category?.name}
                  </span>

                  <h3 className={styles.productName}>{product.name}</h3>

                  <div className={styles.cardFooter}>
                    <span className={styles.price}>
                      Rs. {Number(product.base_price).toLocaleString("en-PK")}
                    </span>

                    <span className={styles.reviews}>
                      {product.reviews ?? 0} reviews
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
