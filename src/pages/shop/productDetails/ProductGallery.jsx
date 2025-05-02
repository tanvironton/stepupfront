/* eslint-disable react/prop-types */
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import emptyImage from "@/assets/no-image.png";

function ProductGallery({ gallery }) {
  const images = gallery?.length > 0
    ? gallery.map((image) => ({
        original: image || emptyImage,
        thumbnail: image || emptyImage,
      }))
    : [
        {
          original: emptyImage,
          thumbnail: emptyImage,
        },
      ];

  return (
    <ReactImageGallery
      additionalClass="product-gallery"
      thumbnailPosition="right"
      autoPlay={true}
      showPlayButton={false}
      showNav={false}
      lazyLoad={true}
      items={images}
    />
  );
}

export default ProductGallery;
