import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";

export const metadata = {
  title: 'Home',
}

const Homepage = async () => {

  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return <>
  { featuredProducts.length > 0 && <ProductCarousel data={ featuredProducts } /> }
  <ProductList limit={4} data={latestProducts} title="Newest Arrivals"></ProductList>
  <ViewAllProductsButton />
  </>;
}
 
export default Homepage;