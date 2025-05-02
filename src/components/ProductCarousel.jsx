import Carousel from "react-gallery-carousel";
import "react-gallery-carousel/dist/index.css";

import productImage from "@/assets/images/casuals_black.jpg";

const images = [...Array(10)].map(() => ({ src: productImage }));

function ProductCarousel() {
  return (
    <div>
      <Carousel
        images={images}
        maxIcon={false}
        hasMediaButton={false}
        hasIndexBoard={false}
        style={{
          backgroundColor: "transparent",
        }}
        hasLeftButton={false}
        hasRightButton={false}
      />
    </div>
  );
}

export default ProductCarousel;
