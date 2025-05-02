/* eslint-disable react/prop-types */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SlickSlider from "@/components/SlickSlider";
import { Suspense } from "react";

function ProductTab({ data, title }) {
  // Filter Bestseller and Top Sell products
  const bestSellerProducts = data?.filter((item) => item.bestseller);
  const topSellProducts = data?.filter((item) => item.topSell);

  return (
    <section className="p-5 ">
    

      {/* Tabs for Bestsellers & Top Selling */}
      <Tabs defaultValue="bestsellers" className="w-full">
        <div className="flex justify-center mb-4 bg-gray-100 p-2 rounded-lg">
          <TabsList className="flex space-x-4 bg-gray-100 rounded-lg">
            <TabsTrigger value="bestsellers" className="text-xl p-2">🔥 Bestsellers</TabsTrigger>
            <TabsTrigger value="topsellers" className="text-xl p-2">🏆 Top Sellers</TabsTrigger>
          </TabsList>
        </div>

        {/* Bestselling Products */}
        <TabsContent value="bestsellers">
          {bestSellerProducts.length > 0 ? (
            // <Suspense fallback={"Loading..."}>
              <SlickSlider data={bestSellerProducts} />
            // </Suspense>
          ) : (
            <p className="text-center text-gray-500">No Bestselling products found.</p>
          )}
        </TabsContent>

        {/* Top Selling Products */}
        <TabsContent value="topsellers">
          {topSellProducts.length > 0 ? (
            <Suspense fallback={"Loading..."}>
              <SlickSlider data={topSellProducts} />
            </Suspense>
          ) : (
            <p className="text-center text-gray-500">No Top Selling products found.</p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default ProductTab;
