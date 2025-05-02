import Banner from "./Banner";
import OurProducts from "./OurProducts";
import GiftVoucher from "./GiftVoucher";
import ProductTab from "./ProductTab";
import HandpickedCollection from "./HandpickedCollection";
import { useFetchAllProdutsQuery } from "@/redux/features/products/productsApi";
import Loading from "@/components/Loading";
import CategorybaseProduct from "./CategorybaseProduct";


const Home = () => {
  const { isLoading, data } = useFetchAllProdutsQuery({ category: "all" });
  const products = data?.data?.products;
  const bestSellerProducts = products?.filter(product => product.bestseller);
const topSellProducts = products?.filter(product => product.topSell);

console.log("Best Seller Products:", bestSellerProducts);
console.log("Top Sell Products:", topSellProducts);

  if (isLoading) return <Loading />;

  return (
    <>
      <Banner />
      <OurProducts />
      <GiftVoucher />
      <div className="max-w-[80%] mx-auto">
        <ProductTab tab={true} title={"JUST LANDED"} data={products}  /> 
      </div>
      <div className="max-w-[80%] mx-auto">
      <CategorybaseProduct data={products} category={{ label: "Mens", value: 'Men' }} />
      </div>
      {/* <HandpickedCollection
        title={"OUR HAND PICKED COLLECTION FOR YOU"}
        grid={"2"}
      /> */}
      {/* <ProductTab tab={false} title={"Featured Products"} data={products} />
      <ProductTab tab={false} title={"Best Seller"} data={products} /> */}
      {/* <HandpickedCollection title={"PICK YOUR FAVOURITES"} grid={"3"} /> */}
    </>
  );
};

export default Home;
