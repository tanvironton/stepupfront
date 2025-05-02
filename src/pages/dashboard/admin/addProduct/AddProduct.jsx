import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getBaseUrl } from '@/utils/getBaseUrl';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  // New state for tracking size stock quantities
  const [sizeStock, setSizeStock] = useState([]);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCategoryValue, setNewCategoryValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [gallery, setGallery] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [topSell, setTopSell] = useState(false);
  const [rating, setRating] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [showColorModal, setShowColorModal] = useState(false);
  const [newColor, setNewColor] = useState({ name: "", hexCode: "#000000" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Adding a selected color state to replace the multiple color selection
  const [selectedColor, setSelectedColor] = useState('');

  // Fetch data functions
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/categories`);
      if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
        console.error('Expected an array of categories, but got:', response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/colors/all`);
      setColors(response.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/sizes/`);
      setSizes(response.data);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchSizes();
    
    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // When selectedSizes changes, update sizeStock array
  useEffect(() => {
    // Create or update sizeStock entries for selected sizes
    const updatedSizeStock = selectedSizes.map(sizeId => {
      // Check if we already have stock for this size
      const existingStock = sizeStock.find(item => item.size === sizeId);
      
      // If we do, keep the stock quantity, otherwise default to 0
      return {
        size: sizeId,
        stock: existingStock ? existingStock.stock : 0
      };
    });
    
    setSizeStock(updatedSizeStock);
  }, [selectedSizes]);

  // Handle category addition
  const handleAddCategory = async () => {
    if (!newCategoryLabel.trim() || !newCategoryValue.trim()) {
      toast.error('Category label and value are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const categoryData = {
        label: newCategoryLabel,
        value: newCategoryValue
      };
      
      const response = await axios.post(`${getBaseUrl()}/api/categories/create-category`, categoryData);
      
      // Update categories and select the new one
      await fetchCategories();
      setCategory(response.data._id);
      
      toast.success('Category added successfully!');
      setShowModal(false);
      setNewCategoryLabel('');
      setNewCategoryValue('');
    } catch (error) {
      toast.error('Failed to add category');
      console.error('Error adding category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle size addition
  const handleAddSize = async () => {
    if (!newSize.trim()) {
      toast.error("Please enter a size!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${getBaseUrl()}/api/sizes/create-size`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSize, value: newSize }),
      });

      if (response.ok) {
        const result = await response.json();
        // Add the new size to the list and select it
        await fetchSizes();
        setSelectedSizes([...selectedSizes, result._id]);
        
        toast.success("Size added successfully!");
        setNewSize("");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to add size!");
      }
    } catch (error) {
      console.error("Error adding size:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle color addition
  const handleAddColor = async () => {
    if (!newColor.name.trim()) {
      toast.error("Please enter a color name!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${getBaseUrl()}/api/colors/create-color`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newColor),
      });

      if (response.ok) {
        const result = await response.json();
        // Add the new color to the list and select it
        await fetchColors();
        // Set as the selected color instead of adding to array
        setSelectedColor(result._id);
        
        toast.success("Color added successfully!");
        setNewColor({ name: "", hexCode: "#000000" });
        setShowColorModal(false);
      } else {
        toast.error("Failed to add color!");
      }
    } catch (error) {
      console.error("Error adding color:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated to handle single color selection
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  // Handle multiple sizes selection
  const handleSizeChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedSizes(selected);
  };

  // Handle stock quantity change for a specific size
  const handleStockChange = (sizeId, quantity) => {
    setSizeStock(prevStock => 
      prevStock.map(item => 
        item.size === sizeId 
          ? { ...item, stock: parseInt(quantity, 10) || 0 } 
          : item
      )
    );
  };

  // Handle gallery change (file upload)
  const handleGalleryChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Create object URLs for preview
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    
    // Update both gallery and preview URLs
    setGallery([...gallery, ...newFiles]);
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  // ReactQuill editor change handlers
  const handleEditorChange = (value) => {
    setLongDescription(value);
  };
  
  const handleEditorChange1 = (value) => {
    setTermsAndConditions(value);
  };
  
  const handleEditorChange2 = (value) => {
    setDescription(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setLoading(true);
    setIsSubmitting(true);

    // Validate required fields
    if (!name || !category || !price || !description || gallery.length === 0) {
      toast.error("Please fill all required fields (name, category, price, description, and at least one gallery image)");
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    // Validate color selection
    if (!selectedColor) {
      toast.error("Please select a color for the product");
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      
      // Append all product fields directly to formData instead of nesting in productData
      formData.append('name', name);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('longDescription', longDescription || '');
      formData.append('price', price);
      
      // Add old price only if it has a value
      if (oldPrice) {
        formData.append('oldPrice', oldPrice);
      }
      
      // Add rating only if it has a value
      if (rating) {
        formData.append('rating', rating);
      }
      
      formData.append('discount', '0');
      formData.append('bestseller', bestseller);
      formData.append('topSell', topSell);
      formData.append('termsAndConditions', termsAndConditions || '');
      
      // Append single color
      formData.append('color', selectedColor);
      
      // Append sizes as arrays for backward compatibility
      selectedSizes.forEach(size => {
        formData.append('sizes', size);
      });
      
      // Append size stock information as JSON
      formData.append('sizeStock', JSON.stringify(sizeStock));
      
      // Append gallery images
      gallery.forEach((file) => {
        formData.append('gallery', file);
      });

      const token = Cookies.get('token');

      // Make the API request
      await axios.post(`${getBaseUrl()}/api/products/create-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      toast.success("Product created successfully!");
      
      // Clean up any existing preview URLs
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      // Reset form after successful submission
      setName('');
      setCategory('');
      setDescription('');
      setLongDescription('');
      setPrice('');
      setOldPrice('');
      setGallery([]);
      setImagePreviewUrls([]);
      setBestseller(false);
      setTopSell(false);
      setRating('');
      setTermsAndConditions('');
      setSelectedColor('');
      setSelectedSizes([]);
      setSizeStock([]);

      // Navigate to products list page
      navigate('/dashboard/add-product');
      
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Render a color preview
  const renderColorPreview = () => {
    if (!selectedColor) return null;
    
    const color = colors.find(c => c._id === selectedColor);
    if (!color) return null;
    
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        <div 
          className="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1"
        >
          <div 
            className="w-4 h-4 rounded-full border border-gray-300" 
            style={{ backgroundColor: color.hexCode }}
          ></div>
          <span>{color.name}</span>
        </div>
      </div>
    );
  };

  const renderSizeStockInputs = () => {
    if (selectedSizes.length === 0) return null;
  
    return (
      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-700 mb-2">Size Stock Quantities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sizeStock.map((item) => {
            const size = sizes.find(s => s._id === item.size);
            if (!size) return null;
  
            return (
              <div key={item.size} className="border rounded-md p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 mr-2">
                    {size.name}
                  </div>
                  <span className="text-sm font-medium">{size.name} Size</span>
                </div>
                <div className="flex items-center">
                  <label className="text-sm mr-2">Stock:</label>
                  <input
                    type="number"
                    min="0"
                    value={item.stock}
                    onChange={(e) => handleStockChange(item.size, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Improved method to remove images with proper cleanup
  const handleRemoveImage = (index) => {
    // Get the URL to be removed
    const urlToRemove = imagePreviewUrls[index];
    
    // Revoke the Object URL to prevent memory leaks
    URL.revokeObjectURL(urlToRemove);
    
    // Remove the file and URL from state
    setGallery(prevGallery => prevGallery.filter((_, i) => i !== index));
    setImagePreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Product Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Category Dropdown and Add New Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium">Category <span className="text-red-500">*</span></label>
          <div className="flex gap-4">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              {categories && categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-white p-2 text-center rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
              disabled={isSubmitting}
            >
              Add New Category
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description <span className="text-red-500">*</span></label>
          <ReactQuill
            id="description"
            theme="snow"
            value={description}
            onChange={handleEditorChange2}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Long Description */}
        <div>
          <label htmlFor="longDescription" className="block text-sm font-medium">Long Description</label>
          <ReactQuill
            id="longDescription"
            theme="snow"
            value={longDescription}
            onChange={handleEditorChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium">Price <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Old Price */}
        <div>
          <label htmlFor="oldPrice" className="block text-sm font-medium">Old Price</label>
          <input
            type="number"
            id="oldPrice"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Gallery */}
        <div>
          <label htmlFor="gallery" className="block text-sm font-medium">Gallery <span className="text-red-500">*</span></label>
          <input
            type="file"
            multiple
            id="gallery"
            onChange={handleGalleryChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            accept="image/*"
          />
          
          {gallery.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">{gallery.length} files selected</p>

              {/* Display Selected Images */}
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviewUrls.map((imageUrl, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Selected ${index}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Color Selection (Single) */}
        <div className="mb-4">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <select
              id="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a Color</option>
              {colors &&
                colors.map((color) => (
                  <option key={color._id} value={color._id}>
                    {color.name}
                  </option>
                ))}
            </select>
            
            {/* Display color preview */}
            {renderColorPreview()}
            
            <button
              type="button"
              onClick={() => setShowColorModal(true)}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              disabled={isSubmitting}
            >
              🎨 Add New Color
            </button>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">
            Sizes <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <select
              id="sizes"
              multiple
              value={selectedSizes}
              onChange={handleSizeChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              {sizes &&
                sizes.map((size) => (
                  <option key={size._id} value={size._id}>
                    {size.name}
                  </option>
                ))}
            </select>
            
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
              disabled={isSubmitting}
            >
              ➕ Add New Size
            </button>
            
            {/* Add size stock inputs */}
            {renderSizeStockInputs()}
          </div>
        </div>

        {/* Bestseller and Top Seller checkboxes */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={() => setBestseller(!bestseller)}
              className="mr-2"
            />
            Bestseller
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={topSell}
              onChange={() => setTopSell(!topSell)}
              className="mr-2"
            />
            Top Seller
          </label>
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium">Rating</label>
          <input
            type="number"
            id="rating"
            min="0"
            max="5"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Terms and Conditions */}
        <div>
          <label htmlFor="termsAndConditions" className="block text-sm font-medium">Terms and Conditions</label>
          <ReactQuill
            id="termsAndConditions"
            theme="snow"
            value={termsAndConditions}
            onChange={handleEditorChange1}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading || isSubmitting}
        >
          {loading ? 'Submitting...' : 'Add Product'}
        </button>
      </form>

      {/* Modal for Adding New Category */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <div className="mb-4">
              <label htmlFor="newCategoryLabel" className="block text-sm font-medium">Category Label</label>
              <input
                type="text"
                id="newCategoryLabel"
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newCategoryValue" className="block text-sm font-medium">Category Value</label>
              <input
                type="text"
                id="newCategoryValue"
                value={newCategoryValue}
                onChange={(e) => setNewCategoryValue(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding New Size */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-700">Add New Size</h2>
            <input
              type="text"
              placeholder="Enter size (e.g. XXL)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="mt-3 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSize}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding New Color */}
      {showColorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-700">Add New Color</h2>
            <input
              type="text"
              placeholder="Enter color name (e.g. Red)"
              value={newColor.name}
              onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              className="mt-3 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />

            {/* Color Picker */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="color"
                value={newColor.hexCode}
                onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                className="w-10 h-10 border rounded-md cursor-pointer"
              />
              <span className="text-gray-600">{newColor.hexCode}</span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowColorModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;