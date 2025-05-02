/* eslint-disable react/prop-types */
import ProductTab from "@/pages/home/ProductTab";

function RelatedProduct({ data }) {
  return (
    <div>
      <ProductTab tab={false} title={"Related Products"} data={data} />
    </div>
  );
}

export default RelatedProduct;
