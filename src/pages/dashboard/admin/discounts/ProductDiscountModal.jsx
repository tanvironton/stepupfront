import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { getBaseUrl } from "@/utils/getBaseUrl";

const ProductDiscountModal = ({ item, isOpen, onClose, refetch }) => {
  // Rename prop from 'product' to 'item' to match how it's being called
  const [discount, setDiscount] = useState(0);
  const [discountBase, setDiscountBase] = useState("price");
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState("");

  // Initialize state from item when it changes
  useEffect(() => {
    if (item) {
      setDiscount(item.discount || 0);
      setProductId(item._id || item.id || "");
    }
  }, [item]);

  const handleDiscountChange = (e) => {
    const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
    setDiscount(value);
  };

  const updateProductDiscount = async () => {
    // Check if we have a valid product ID before making the API call
    if (!productId) {
      toast.error("Invalid product information");
      return;
    }

    setIsLoading(true);
    try {
      // Make sure this matches your backend API endpoint
      const response = await axios.patch(`${getBaseUrl()}/api/products/discount/${productId}`, {
        productId: productId,
        discountPercentage: parseInt(discount),
        discountBase: discountBase,
      });
      
      toast.success("Product discount updated successfully");
      if (typeof refetch === 'function') {
        refetch();
      }
      onClose();
    } catch (error) {
      console.error("Failed to update product discount:", error);
      toast.error(error.response?.data?.message || "Failed to update discount");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">
          Update Product Discount
        </h2>
        
        {!productId && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            Warning: Product information is missing or invalid
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Percentage (%)
          </label>
          <input
            value={discount}
            onChange={handleDiscountChange}
            type="number"
            min="0"
            max="100"
            placeholder="Enter discount percentage"
            className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apply Discount Based On:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="price"
                checked={discountBase === "price"}
                onChange={() => setDiscountBase("price")}
                className="mr-2"
              />
              <span className="text-sm">Current Price</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="oldPrice"
                checked={discountBase === "oldPrice"}
                onChange={() => setDiscountBase("oldPrice")}
                className="mr-2"
              />
              <span className="text-sm">Original Price</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={updateProductDiscount}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading || !productId ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading || !productId}
          >
            {isLoading ? 'Updating...' : 'Update Discount'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDiscountModal;