import { useState } from "react";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";

import styles from "./ProductsFilter.module.css";
import IsDark from "../../../../utils/themeUtility/isDark.jsx";
import useRootCategories from "../../../categories/hooks/useRootCategories.js";
import useCategoryDetails from "../../../categories/hooks/useCategoryDetails.js";

const ProductFilters = ({ filters, onChange, onReset }) => {
  const isDark = IsDark();
  const { data, isLoading } = useRootCategories();

  const rootCategories = data?.categories ?? [];

  return (
    <aside
      className={`${styles.sidebar} ${
        isDark ? styles.sidebarDark : styles.sidebarLight
      }`}
    >
      <div className={styles.header}>
        <h2>Filters</h2>

        <button type="button" className={styles.resetButton} onClick={onReset}>
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <section className={styles.section}>
        <h3>Categories</h3>

        {isLoading ? (
          <p className={styles.muted}>Loading categories...</p>
        ) : rootCategories.length === 0 ? (
          <p className={styles.muted}>No categories available.</p>
        ) : (
          <div className={styles.categoryList}>
            {rootCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                filters={filters}
                onChange={onChange}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h3>Price</h3>

        <div className={styles.priceInputs}>
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.min_price}
            onChange={(event) =>
              onChange({
                min_price: event.target.value,
              })
            }
          />

          <span>—</span>

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.max_price}
            onChange={(event) =>
              onChange({
                max_price: event.target.value,
              })
            }
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3>Sort by</h3>

        <select
          value={filters.sort}
          onChange={(event) =>
            onChange({
              sort: event.target.value,
            })
          }
        >
          <option value="">Default</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </section>

      <section className={styles.section}>
        <h3>Sort order</h3>

        <select
          value={filters.order}
          onChange={(event) =>
            onChange({
              order: event.target.value,
            })
          }
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </section>
    </aside>
  );
};

const CategoryItem = ({ category, filters, onChange, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading } = useCategoryDetails(category.slug, {
    enabled: expanded,
  });

  const children = data?.category?.children ?? [];
//   const hasChildren = children.length > 0 || (expanded && isLoading);
  const isSelected = filters.category === category.slug;

  const selectCategory = (slug) => {
    onChange({
      category: filters.category === slug ? "" : slug,
    });
  };

  const toggleCategory = () => {
    setExpanded((current) => !current);
  };

  return (
    <div className={styles.categoryItem}>
      <div className={styles.categoryRow}>
        <button
          type="button"
          className={`${styles.expandButton} ${
            isDark ? styles.darkButton : ""
          }`}
          onClick={toggleCategory}
          aria-label={
            expanded ? `Collapse ${category.name}` : `Expand ${category.name}`
          }
          aria-expanded={expanded}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <button
          type="button"
          className={`${styles.categoryButton} ${
            isSelected ? styles.selected : ""
          }`}
          onClick={() => selectCategory(category.slug)}
        >
          {category.name}
        </button>
      </div>

      {expanded && (
        <div className={styles.children}>
          {isLoading ? (
            <span className={styles.muted}>Loading...</span>
          ) : children.length === 0 ? (
            <span className={styles.muted}>No subcategories</span>
          ) : (
            children.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                filters={filters}
                onChange={onChange}
                isDark={isDark}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
