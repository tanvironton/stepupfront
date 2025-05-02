
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SizeAttribute from "./SizeAttbute";
import ColorAttribute from "./ColorAttbute";
// import CategoryAttribute from "./CategoryAttibute";
const ManageAllProductComponent = () => {
    return (
        <div>
        <Tabs defaultValue="size" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger
              className={
                "shadow-none data-[state=active]:shadow-none data-[state=active]:border"
              }
              value="size"
            >
              Size
            </TabsTrigger>
            {/* <TabsTrigger
              className={
                "shadow-none data-[state=active]:shadow-none data-[state=active]:border"
              }
              value="categories"
            >
              Categories
            </TabsTrigger> */}
            <TabsTrigger
              className={
                "shadow-none data-[state=active]:shadow-none data-[state=active]:border"
              }
              value="color"
            >
             Color
            </TabsTrigger>
          </TabsList>
          <TabsContent value="size">
          <SizeAttribute/>
          </TabsContent>
          {/* <TabsContent value="categories">
            <CategoryAttribute/>
          </TabsContent> */}
          <TabsContent value="color">
            <ColorAttribute/>
          </TabsContent>
        </Tabs>
      </div>
    );
}

export default ManageAllProductComponent;
