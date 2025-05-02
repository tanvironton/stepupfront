import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { getBaseUrl } from "@/utils/getBaseUrl";

const CategoryDiscountModal = ({ item, isOpen, onClose, refetch, type }) => {
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update state when item prop changes
  useEffect(() => {
    if (item) {
      setDiscount(item.discount || 0);
    }
  }, [item]);

  const handleInputChange = (e) => {
    const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
    setDiscount(value);
  };

  const handleUpdate = async () => {
    // Validate item ID exists
    if (!item || (!item._id && !item.id)) {
      toast.error("Invalid category. Please try again.");
      return;
    }

    const categoryId = item._id || item.id;

    if (discount < 0 || discount > 100) {
      toast.error("Discount must be between 0 and 100");
      return;
    }

    setIsLoading(true);
    try {
      // Make the API call to update the discount
      const response = await axios.put(
        `${getBaseUrl()}/api/categories/${categoryId}/discount`,
        { discount }
      );

      toast.success("Category discount updated successfully");
      if (typeof refetch === 'function') {
        refetch();
      }
      onClose();
    } catch (error) {
      console.error("Failed to update discount:", error);
      const errorMessage = error.response?.data?.message || "Failed to update discount";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">
          Update Discount for {item?.label || "Category"}
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Percentage:
          </label>
          <input
            value={discount}
            onChange={handleInputChange}
            type="number"
            min={0}
            max={100}
            placeholder="Enter discount percentage"
            className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will update prices for all products in this category where the current discount is less than this value.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : "Update Discount"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDiscountModal;