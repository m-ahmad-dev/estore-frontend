import { Link, useParams } from "react-router-dom";
import { AlertCircle, ChevronRight, LoaderCircle } from "lucide-react";

import useProduct from "../hooks/useProduct";
import ProductGallery from "../components/product-detail/ProductGallery";
import ProductInfo from "../components/product-detail/ProductInfo";

import styles from "./ProductDetail.module.css";
import IsDark from "../../../utils/themeUtility/isDark.jsx";

const ProductDetail = () => {
  const isDark = IsDark();
  const { slug } = useParams();

  const { data, isLoading, isError } = useProduct(slug);
  const product = data?.product ?? null;

  if (isLoading) {
    return (
      <main
        className={`${styles.page} ${
          isDark ? styles.pageDark : styles.pageLight
        }`}
      >
        <div className={styles.state}>
          <LoaderCircle
            size={32}
            className={styles.spinner}
            aria-hidden="true"
          />
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main
        className={`${styles.page} ${
          isDark ? styles.pageDark : styles.pageLight
        }`}
      >
        <div className={styles.state}>
          <div className={styles.errorIcon}>
            <AlertCircle size={30} />
          </div>

          <h1>Product unavailable</h1>

          <p>
            We couldn't load this product. It may have been removed or is
            temporarily unavailable.
          </p>

          <Link to="/products" className={styles.backButton}>
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`${styles.page} ${
        isDark ? styles.pageDark : styles.pageLight
      }`}
    >
      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link to="/">Home</Link>

          <ChevronRight size={15} aria-hidden="true" />

          <Link to="/products">Products</Link>

          <ChevronRight size={15} aria-hidden="true" />

          <span>{product.name}</span>
        </nav>

        <section className={styles.productLayout}>
          <ProductGallery
            key={product.slug}
            images={product.images}
            productName={product.name}
          />

          <ProductInfo key={product.id} product={product} />
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
