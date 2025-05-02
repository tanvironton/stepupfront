import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsDiscountTable from "./ProductsDiscountTable";
import CategoriesDiscountTable from "./CategoriesDiscountTable";

function ManageDiscounts() {
  return (
    <div>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2">
          <TabsTrigger
            className={
              "shadow-none data-[state=active]:shadow-none data-[state=active]:border"
            }
            value="products"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            className={
              "shadow-none data-[state=active]:shadow-none data-[state=active]:border"
            }
            value="categories"
          >
            Categories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsDiscountTable />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesDiscountTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ManageDiscounts;
