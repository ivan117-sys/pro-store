import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

export const metadata = {
  title: 'Home',
}

const Homepage = async () => {

  const latestProducts = await getLatestProducts();

  return <>
  
  <ProductList limit={4} data={latestProducts} title="Newest Arrivals"></ProductList>
  
  </>;
}
 
export default Homepage;