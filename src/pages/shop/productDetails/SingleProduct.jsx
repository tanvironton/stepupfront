import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RelatedProduct from "./RelatedProduct";
import {
  useFetchProductbyIdQuery,
  useFetchRelatedProductsQuery,
} from "@/redux/features/products/productsApi";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { useEffect, useState } from "react";
import ErrorPage from "@/components/ErrorPage";
import ProductGallery from "./ProductGallery";
import { priceDisplay } from "@/utils";
import toast from "react-hot-toast";
import ProductReviewForm from "../reviews/ProductReviewForm";

// single product page
const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(null); // Changed to null initially
  const [selectedColor, setSelectedColor] = useState("");
  const res = useFetchProductbyIdQuery(id);
  const cartProducts = useSelector((state) => state?.cart?.products);

  const { data, isLoading, isError } = res;
  const { data: relatedProducts } = useFetchRelatedProductsQuery(id);

  const {
    _id,
    gallery,
    sku,
    name,
    color,
    description,
    price,
    discount,
    discountedPrice,
    category,
    oldPrice,
    sizes,
    sizeStock,
    longDescription,
    termsAndConditions
  } = data?.data?.product || {};

  const selectedSize = `bg-black text-white`;
  const calculateSubtotal =
    quantity * priceDisplay(discount, oldPrice, discountedPrice);

  const handleSelectSize = (selectedSizeObj) => {
    // Check if size has stock before allowing selection
    const sizeStockItem = sizeStock?.find(item => 
      item.size && (item.size._id === selectedSizeObj._id || item.size === selectedSizeObj._id)
    );
    
    if (sizeStockItem && sizeStockItem.stock > 0) {
      setSize(selectedSizeObj);
    } else {
      toast.error("Selected size is out of stock");
    }
  };

  const handleSelectColor = (colorHex) => {
    setSelectedColor(colorHex);
  };

  const handleQuantityIncrement = () => {
    const newQuantity = Math.max(1, quantity + 1);
    setQuantity(newQuantity);
  };

  const handleQuantityDecrement = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
  };

  const handleAddCart = () => {
    const product = data?.data?.product;

    // Check if size and color are selected
    if (!selectedColor || !size) {
      toast.error("Please select size and color");
      return;
    }

    // Check if the selected size has stock
    const sizeStockItem = sizeStock?.find(item => 
      item.size && (item.size._id === size._id || item.size === size._id)
    );
    
    if (!sizeStockItem || sizeStockItem.stock <= 0) {
      toast.error("Selected size is out of stock");
      return;
    }

    dispatch(
      addToCart({
        _id,
        ...product,
        quantity,
        subTotal: calculateSubtotal,
        size,
        selectedColor: selectedColor,
      })
    );
    
    // Show success toast
    // toast.success("Product added to cart!");
  };

  useEffect(() => {
    const exist = cartProducts.find((item) => item._id === id);
    if (exist) {
      setSize(exist.size);
      setSelectedColor(exist.selectedColor);
    } else if (color && color.hexCode) {
      setSelectedColor(color.hexCode);
      
      // Try to select first available size with stock
      if (sizeStock && sizeStock.length > 0) {
        const firstAvailableSize = sizeStock.find(item => item.stock > 0);
        if (firstAvailableSize && firstAvailableSize.size) {
          setSize(firstAvailableSize.size);
        }
      }
    }
  }, [cartProducts, id, color, sizeStock]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <section className="p-5 md:grid grid-cols-2 gap-6">
          <div className="overflow-hidden">
            <div className="relative">
              <ProductGallery gallery={gallery} />
            </div>
          </div>

          <div className="p-5">
            <div>
              <h1 className="text-2xl font-semibold">{name}</h1>
            </div>

            <div className="my-5">
              <p className="flex items-center space-x-2 text-3xl font-medium">
              {oldPrice > 0 && (
                  <del className="text-slate-400">&#x9F3;{Math.round(oldPrice)} </del>
                )}
                &nbsp;
                <span className="text-gray-700">&#x9F3;</span>
                {Math.round(price)}
              </p>
            </div>

            <div 
              className="my-5 text-gray-700 mb-6" 
              dangerouslySetInnerHTML={{ __html: description }} 
            />

            {/* Size Selection */}
            <div className="my-5">
              <label htmlFor="Size" className="text-red-700">
                Size*
              </label>
              <div className="flex items-center gap-3 justify-start mt-2 flex-wrap">
                {[...(sizes || [])]
                  .sort((a, b) => parseInt(a.name) - parseInt(b.name))
                  .map((item) => {
                    // Find the stock information for this size
                    const sizeStockItem = sizeStock?.find(
                      stockItem => stockItem.size && 
                      (stockItem.size._id === item._id || 
                      stockItem.size.toString() === item._id.toString())
                    );
                    
                    // A size has stock if sizeStockItem exists AND stock is greater than 0
                    const stockQuantity = sizeStockItem ? sizeStockItem.stock : 0;
                    const hasStock = stockQuantity > 0;
                    
                    // Check if this size is selected
                    const isSelected = size && (size._id === item._id || size === item._id);
                    
                    return (
                      <div key={item._id} className="text-center mb-2">
                        <button
                          type="button"
                          onClick={() => handleSelectSize(item)}
                          disabled={!hasStock}
                          className={`
                            ${isSelected ? selectedSize : 'bg-white text-black'} 
                            p-2 w-10 h-10 object-cover border block text-center rounded-full 
                            ${hasStock ? 'cursor-pointer hover:bg-gray-200' : 'cursor-not-allowed opacity-50 bg-gray-100'}
                          `}
                        >
                          {item.name}
                        </button>
                        {/* <div className="text-xs mt-1">
                          {hasStock ? (
                            <span className="text-green-600">
                              In Stock ({stockQuantity})
                            </span>
                          ) : (
                            <span className="text-red-500">Out of Stock</span>
                          )}
                        </div> */}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Color Selection */}
            <div className="my-5">
              <label htmlFor="Color" className="text-red-700">
                Color*
              </label>
              <div className="flex items-center gap-2 justify-start mt-2">
                {color && (
                  <div className="flex flex-col items-center">
                    <span
                      onClick={() => handleSelectColor(color.hexCode)}
                      style={{
                        backgroundColor: color.hexCode,
                        border: selectedColor === color.hexCode ? `3px solid black` : `1px solid gray`,
                      }}
                      className={`p-2 w-10 h-10 object-cover block text-center rounded-full cursor-pointer hover:opacity-80`}
                    ></span>
                    <span className="text-xs mt-1">{color.name}</span>
                  </div>
                )}
              </div>
            </div>
 
            <div className="flex gap-5 my-3">
              <div className="bg-slate-400 p-3 rounded-md w-40 flex items-center justify-around">
                <button onClick={handleQuantityDecrement} className="text-xl">
                  -
                </button>
                <input
                  readOnly
                  className="bg-transparent caret-transparent outline-none border-none w-1/2 text-center"
                  type="text"
                  value={quantity || ""}
                  size={20}
                />
                <button onClick={handleQuantityIncrement} className="text-xl">
                  +
                </button>
              </div>
              <div>
                <button
                  onClick={handleAddCart}
                  className="bg-slate-900 py-3 px-10 w-full text-slate-100 text-xl rounded-sm hover:bg-red-500 duration-300"
                >
                  ADD TO CART
                </button>
              </div>
            </div>

            <div className="flex justify-center py-3 my-3 rounded-sm w-full md:w-[400px] bg-[#0ac042]">
              <a
                href="tel:+8801794003065"
                className="flex items-center text-xl text-white hover:text-blue-800"
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="white"
                >
                  <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
                </svg>
                <span>কল করুনঃ +880 1643620848</span>
              </a>
            </div>
            
            <div className="flex space-x-6 mt-4">
              {/* Share buttons remain the same */}
              {/* Facebook Share Button */}
              <div className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform py-1 px-2 hover:scale-105">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white text-sm"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
                  </svg>
                  <span>Facebook</span>
                </a>
              </div>

              {/* WhatsApp Share Button */}
              <div className="flex items-center bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                <a
                  href={`https://wa.me/?text=${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white"
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    fill="currentColor"
                  >
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Email Share Button */}
              <div className="flex items-center bg-gradient-to-r from-gray-500 to-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                <a
                  href={`mailto:?subject=Check%20this%20out&body=${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white"
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"></path>
                  </svg>
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="my-10 max-w-6xl mx-auto">
        <Tabs defaultValue="description" className="w-full gap-2">
          <TabsList className="grid w-full md:grid-cols-3 gap-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="conditions">Terms and conditions</TabsTrigger>
            <TabsTrigger value="reviews">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <div className="m-10">
              <div
                className="preview"
                dangerouslySetInnerHTML={{ __html: longDescription }}
              />
            </div>
          </TabsContent>

          <TabsContent value="conditions">
            <div className="m-10">
              <div
                className="preview"
                dangerouslySetInnerHTML={{ __html: termsAndConditions }}
              />
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="m-10">
              <ProductReviewForm productId={id} />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="">
        {relatedProducts?.length > 0 && (
          <RelatedProduct data={relatedProducts} />
        )}
      </section>
    </>
  );
};

export default SingleProduct;