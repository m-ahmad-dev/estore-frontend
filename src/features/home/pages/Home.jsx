import HeroSection from "../components/hero-section/HeroSection";
import CategorySection from "../components/category-section/CategorySection";
import ProductSection from "../components/product-section/ProductSection.jsx";
import HomeCta from "../components/home-cta/HomeCta.jsx";
import useRootCategories from "../../categories/hooks/useRootCategories.js";
import useProducts from "../../products/hooks/useProducts.js";

const Home = () => {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useRootCategories();

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts({
    limit: 8,
  });

  return (
    <>
      <HeroSection />

      <CategorySection
        categories={categoriesData?.categories ?? []}
        isLoading={categoriesLoading}
        isError={categoriesError}
      />

      <ProductSection
        products={productsData?.products ?? []}
        isLoading={productsLoading}
        isError={productsError}
      />

      <HomeCta />
    </>
  );
};

export default Home;
