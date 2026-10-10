import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./CategorySection.module.css";
import IsDark from "../../../../utils/themeUtilty/isDark.jsx";

const CategorySection = ({ categories = [], isLoading, isError }) => {
  const isDark = IsDark();
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/categories/${encodeURIComponent(slug)}`);
  };

  if (isLoading) {
    return (
      <section
        id="categories"
        className={`${styles.section} ${isDark ? styles.dark : styles.light}`}
      >
        <div className={styles.container}>
          <p className={styles.status}>Loading categories...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        id="categories"
        className={`${styles.section} ${isDark ? styles.dark : styles.light}`}
      >
        <div className={styles.container}>
          <p className={styles.status}>Unable to load categories.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="categories"
      className={`${styles.section} ${isDark ? styles.dark : styles.light}`}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>EXPLORE</span>

            <h2 className={styles.title}>Shop by category</h2>

            <p className={styles.description}>
              Explore our collections and find exactly what you're looking for.
            </p>
          </div>

          <button
            type="button"
            className={styles.viewAll}
            onClick={() => navigate("/products")}
          >
            View all
            <ArrowRight className={styles.viewAllIcon} />
          </button>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <article
              key={category.id}
              className={styles.card}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>
                  {category._count?.products ?? 0} products
                </span>

                <h3 className={styles.cardTitle}>{category.name}</h3>

                {category.description && (
                  <p className={styles.cardDescription}>
                    {category.description}
                  </p>
                )}

                <span className={styles.cardLink}>
                  Explore
                  <ArrowRight className={styles.cardIcon} />
                </span>
              </div>

              <div className={styles.cardDecoration} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
