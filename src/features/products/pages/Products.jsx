import { useMemo, useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

import useInfiniteProducts from "../hooks/useInfiniteProducts";
import useCategoryDetails from "../../categories/hooks/useCategoryDetails";
import styles from "./Products.module.css";
import ProductFilters from "../components/products-filter/ProductsFilter.jsx";
import ProductCard from "../components/products-card/ProductCard.jsx";
import IsDark from "../../../utils/themeUtility/isDark.jsx";

const DEFAULT_FILTERS = {
  category: "",
  min_price: "",
  max_price: "",
  sort: "",
  order: "asc",
};

const Products = () => {
  const isDark = IsDark();
  const navigate = useNavigate();
  const { slug: pathSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Prefer path parameter; fall back to query parameter for transition safety
  const activeCategory = pathSlug ?? searchParams.get("category") ?? "";

  const [filters, setFilters] = useState(() => ({
    category: activeCategory,
    min_price: searchParams.get("min_price") ?? "",
    max_price: searchParams.get("max_price") ?? "",
    sort: searchParams.get("sort") ?? "",
    order: searchParams.get("order") ?? "asc",
  }));

  // Keep local filter state in sync when the route changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: activeCategory,
    }));
  }, [activeCategory]);

  const query = searchParams.get("q") ?? "";

  // Fetch category name for the page header when on a category route
  const { data: categoryData } = useCategoryDetails(pathSlug, {
    enabled: Boolean(pathSlug),
  });
  const categoryName = categoryData?.category?.name;

  const apiParams = useMemo(() => {
    const params = {
      limit: 10,
    };

    if (query) {
      params.q = query;
    }

    if (filters.category) {
      params.category = filters.category;
    }

    if (filters.min_price) {
      params.min_price = filters.min_price;
    }

    if (filters.max_price) {
      params.max_price = filters.max_price;
    }

    if (filters.sort) {
      params.sort = filters.sort;
    }

    if (filters.sort && filters.order) {
      params.order = filters.order;
    }

    return params;
  }, [query, filters]);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteProducts(apiParams);

  const products = useMemo(
    () => data?.pages?.flatMap((page) => page?.products ?? []) ?? [],
    [data],
  );

  const buildQueryString = (nextFilters, searchQuery) => {
    const nextParams = new URLSearchParams();

    if (searchQuery) {
      nextParams.set("q", searchQuery);
    }

    Object.entries(nextFilters).forEach(([key, value]) => {
      // Category is handled by the path, never by the query string
      if (key === "category") return;

      if (value !== "" && value !== null && value !== undefined) {
        if (key === "order" && !nextFilters.sort) {
          return;
        }
        nextParams.set(key, value);
      }
    });

    const qs = nextParams.toString();
    return qs ? `?${qs}` : "";
  };

  const handleFilterChange = (changes) => {
    const nextFilters = {
      ...filters,
      ...changes,
    };

    setFilters(nextFilters);

    const categoryChanged = Object.prototype.hasOwnProperty.call(
      changes,
      "category",
    );

    if (categoryChanged) {
      const newCategory = nextFilters.category;

      if (newCategory) {
        navigate(
          `/categories/${encodeURIComponent(newCategory)}${buildQueryString(nextFilters, query)}`,
        );
      } else {
        navigate(`/products${buildQueryString(nextFilters, query)}`);
      }
      return;
    }

    // Only non-category filters changed → update query string only
    const nextParams = new URLSearchParams();

    if (query) {
      nextParams.set("q", query);
    }

    Object.entries(nextFilters).forEach(([key, value]) => {
      if (key === "category") return;

      if (value !== "" && value !== null && value !== undefined) {
        if (key === "order" && !nextFilters.sort) {
          return;
        }
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  const handleReset = () => {
    const nextFilters = {
      ...DEFAULT_FILTERS,
    };

    setFilters(nextFilters);

    // Reset always returns to the unfiltered products list
    const nextParams = new URLSearchParams();
    if (query) {
      nextParams.set("q", query);
    }

    navigate(
      `/products${nextParams.toString() ? `?${nextParams.toString()}` : ""}`,
    );
  };

  return (
    <main
      className={`${styles.page} ${
        isDark ? styles.pageDark : styles.pageLight
      }`}
    >
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Store</p>

            <h1>
              {pathSlug && categoryName
                ? categoryName
                : pathSlug
                  ? "Category"
                  : "All Products"}
            </h1>

            {query && (
              <p className={styles.searchResult}>
                Search results for <strong>"{query}"</strong>
              </p>
            )}
          </div>

          {!isLoading && !isError && (
            <span className={styles.productCount}>
              {products.length} products
            </span>
          )}
        </header>

        <div className={styles.layout}>
          <ProductFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />

          <section className={styles.results}>
            {isLoading ? (
              <LoadingState />
            ) : isError ? (
              <ErrorState />
            ) : products.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className={styles.grid}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasNextPage && (
                  <div className={styles.loadMoreWrapper}>
                    <button
                      type="button"
                      className={styles.loadMore}
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? (
                        <>
                          <LoaderCircle size={17} className={styles.spinner} />
                          Loading...
                        </>
                      ) : (
                        "Load more"
                      )}
                    </button>
                  </div>
                )}

                {!hasNextPage && (
                  <p className={styles.endMessage}>
                    You have reached the end of the products.
                  </p>
                )}
              </>
            )}

            {isFetching && !isLoading && !isFetchingNextPage && (
              <div className={styles.backgroundLoading}>
                Updating products...
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

const LoadingState = () => (
  <div className={styles.state}>
    <LoaderCircle size={28} className={styles.spinner} />
    <p>Loading products...</p>
  </div>
);

const EmptyState = () => (
  <div className={styles.state}>
    <h2>No products found</h2>
    <p>Try changing your search or filter options.</p>
  </div>
);

const ErrorState = () => (
  <div className={styles.state}>
    <h2>Unable to load products</h2>
    <p>Something went wrong while retrieving products.</p>
  </div>
);

export default Products;
