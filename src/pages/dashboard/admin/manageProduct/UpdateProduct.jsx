import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getBaseUrl } from '@/utils/getBaseUrl';

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  
  // State for size stock management
  const [sizeStock, setSizeStock] = useState([]);
  
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [gallery, setGallery] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [topSell, setTopSell] = useState(false);
  const [rating, setRating] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingProduct, setExistingProduct] = useState(null);
  const [color, setColor] = useState(''); // Single selected color

  useEffect(() => {
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

    fetchCategories();
    fetchColors();
    fetchSizes();

    // Wait for all initial data to be fetched before fetching product data
    // This ensures we have sizes loaded before trying to match them with product sizes
    Promise.all([fetchCategories(), fetchColors(), fetchSizes()])
      .then(() => fetchProductData())
      .catch(err => console.error("Error loading initial data:", err));
      
  }, [id]);

  const fetchProductData = async () => {
    try {
      // First, fetch basic product info
      const response = await axios.get(`${getBaseUrl()}/api/products/${id}`);
      const product = response.data.data.product;
      setExistingProduct(product);
      setName(product.name);
      setCategory(product.category);
      setDescription(product.description);
      setLongDescription(product.longDescription);
      setPrice(product.price);
      setOldPrice(product.oldPrice);
      

      if (product.color) {
        setCategory(typeof product.category === 'string' ? product.category : product.category._id);
      }

      // Handle color
      if (product.color) {
        setColor(typeof product.color === 'string' ? product.color : product.color._id);
      }
      
      // Handle colors (for backward compatibility)
      if (product.colors && Array.isArray(product.colors)) {
        setSelectedColors(product.colors.map(color => 
          typeof color === 'string' ? color : color._id
        ));
      }
      
      // Handle sizes
      if (product.sizes && Array.isArray(product.sizes)) {
        setSelectedSizes(product.sizes.map(size => 
          typeof size === 'string' ? size : size._id
        ));
      }
      
      setBestseller(product.bestseller);
      setTopSell(product.topSell);
      setRating(product.rating);
      setTermsAndConditions(product.termsAndConditions);
      setGallery(product.gallery || []); // Store existing gallery images

      // Now fetch detailed product with stock information
      try {
        const stockResponse = await axios.get(`${getBaseUrl()}/api/products/stock/${id}`);
        const stockProduct = stockResponse.data.data;
        
        if (stockProduct.sizeStock && Array.isArray(stockProduct.sizeStock)) {
          // Format the size stock data properly
          const formattedSizeStock = stockProduct.sizeStock.map(item => ({
            size: item.size._id || item.size,
            stock: Number(item.stock || 0),
            _id: item._id // Keep the ID if it exists
          }));
          
          console.log("Loaded size stock:", formattedSizeStock);
          setSizeStock(formattedSizeStock);
        }
      } catch (err) {
        console.error("Error fetching product stock data:", err);
      }
    } catch (error) {
      console.error("Error fetching product stock data:", error);
    }
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleSizeChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedSizes(selected);
    
    // For newly selected sizes that don't exist in sizeStock yet, add them with 0 stock
    const updatedSizeStock = [...sizeStock];
    
    selected.forEach(sizeId => {
      // Check if this size is already in sizeStock
      const existingIndex = updatedSizeStock.findIndex(item => 
        item.size === sizeId || (item.size._id && item.size._id === sizeId)
      );
      
      // If not, add it with 0 stock
      if (existingIndex === -1) {
        updatedSizeStock.push({
          size: sizeId,
          stock: 0
        });
      }
    });
    
    // Remove sizes that are no longer selected
    const filteredSizeStock = updatedSizeStock.filter(item => {
      const itemSizeId = item.size._id || item.size;
      return selected.includes(itemSizeId);
    });
    
    setSizeStock(filteredSizeStock);
  };

  const handleStockChange = (sizeId, newStock) => {
    const updatedSizeStock = sizeStock.map(item => {
      const itemSizeId = item.size._id || item.size;
      if (itemSizeId === sizeId) {
        return { ...item, stock: Number(newStock) };
      }
      return item;
    });
    
    setSizeStock(updatedSizeStock);
  };

  const handleGalleryChange = (e) => {
    // Store new files separately
    const files = Array.from(e.target.files);
    setNewGalleryFiles([...newGalleryFiles, ...files]);
    
    // Create preview URLs for the new files
    const newFilePreviewUrls = files.map(file => URL.createObjectURL(file));
    
    // Add preview URLs to gallery state (for display only)
    setGallery([...gallery, ...newFilePreviewUrls]);
  };
  
  const handleRemoveImage = (indexToRemove) => {
    // If it's a new file (has object URL)
    if (typeof gallery[indexToRemove] === 'string' && gallery[indexToRemove].startsWith('blob:')) {
      // Find the corresponding file in newGalleryFiles
      const objectUrl = gallery[indexToRemove];
      const fileIndex = newGalleryFiles.findIndex((_, i) => 
        URL.createObjectURL(newGalleryFiles[i]) === objectUrl
      );
      
      if (fileIndex !== -1) {
        // Remove from newGalleryFiles
        const updatedNewFiles = [...newGalleryFiles];
        updatedNewFiles.splice(fileIndex, 1);
        setNewGalleryFiles(updatedNewFiles);
      }
      
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(gallery[indexToRemove]);
    }
    
    // Remove from gallery state (this affects both existing and new images)
    const updatedGallery = [...gallery];
    updatedGallery.splice(indexToRemove, 1);
    setGallery(updatedGallery);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('longDescription', longDescription);
    formData.append('price', price);
    formData.append('oldPrice', oldPrice);
    formData.append('discount', 0);
    formData.append('bestseller', bestseller);
    formData.append('topSell', topSell);
    formData.append('rating', rating);
    formData.append('termsAndConditions', termsAndConditions);
    
    // Add the color (main primary color)
    if (color) {
      formData.append('color', color);
    }
  
    // Add the existing gallery images that should be kept
    if (existingProduct && existingProduct.gallery) {
      // Find which existing images remain in the gallery state
      const remainingExistingImages = gallery.filter(img => 
        existingProduct.gallery.includes(img) && typeof img === 'string' && !img.startsWith('blob:')
      );
      
      // Add all remaining existing images
      remainingExistingImages.forEach((imgUrl) => {
        formData.append('existingGallery', imgUrl);
      });
    }
  
    // Add new gallery images
    newGalleryFiles.forEach(file => {
      formData.append('gallery', file);
    });
  
    // Handle colors (for backward compatibility)
    if (selectedColors.length > 0) {
      selectedColors.forEach(colorId => {
        formData.append('colors[]', colorId);
      });
    }
  
    // Handle sizes
    if (selectedSizes.length > 0) {
      selectedSizes.forEach(sizeId => {
        formData.append('sizes[]', sizeId);
      });
    }
    
    // Add size stock information as JSON
    if (sizeStock.length > 0) {
      // Prepare the size stock data with just the necessary fields
      const sizeStockData = sizeStock.map(item => ({
        size: item.size._id || item.size,
        stock: Number(item.stock || 0)
      }));
      
      formData.append('sizeStock', JSON.stringify(sizeStockData));
    }
  
    const token = Cookies.get('token');
  
    try {
      // First update the basic product info
      await axios.put(`${getBaseUrl()}/api/products/update-product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      // Then update the size stock
      if (sizeStock.length > 0) {
        // Format size stock updates for the API
        const sizeStockUpdates = sizeStock.map(item => ({
          size: item.size._id || item.size,
          stock: Number(item.stock || 0)
        }));
        
        await axios.patch(`${getBaseUrl()}/api/products/size-stock`, {
          productId: id,
          sizeStockUpdates: sizeStockUpdates
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
  
      toast.success("Product updated successfully!");
      setLoading(false);
      navigate('/dashboard/admin');
    } catch (error) {
      toast.error('Failed to update product');
      console.error(error);
      setLoading(false);
    }
  };

  const handleEditorChange = (value) => {
    setLongDescription(value);
  };
  
  const handleEditorChange1 = (value) => {
    setTermsAndConditions(value);
  };
  
  const handleEditorChange2 = (value) => {
    setDescription(value);
  };

  // Helper function to get current stock for a size
  const getSizeStock = (sizeId) => {
    const stockItem = sizeStock.find(item => {
      const itemSizeId = item.size._id || item.size;
      return itemSizeId === sizeId;
    });
    return stockItem ? stockItem.stock : 0;
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Update Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">Category</label>
          <div className="flex gap-4">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              {categories && Array.isArray(categories) && categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <ReactQuill
            id="description"
            theme="snow"
            value={description}
            onChange={handleEditorChange2}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

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

        <div>
          <label htmlFor="price" className="block text-sm font-medium">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

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

        {/* Gallery with image preview and delete functionality */}
        <div>
          <label htmlFor="gallery" className="block text-sm font-medium">Gallery</label>
          <input
            type="file"
            id="gallery"
            multiple
            onChange={handleGalleryChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="mt-4 grid grid-cols-4 gap-4">
            {gallery.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Product ${index}`} 
                  className="w-full h-24 object-cover rounded" 
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Single Primary Color Selection */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium">Primary Color</label>
          <select
            id="color"
            value={color}
            onChange={handleColorChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="">Select Primary Color</option>
            {colors.map((colorOption) => (
              <option key={colorOption._id} value={colorOption._id}>
                {colorOption.name}
              </option>
            ))}
          </select>
          {color && (
            <div className="mt-2">
              <p className="text-sm font-medium">Selected Primary Color:</p>
              <div className="flex items-center gap-2 mt-1">
                {(() => {
                  const colorObj = colors.find(c => c._id === color);
                  return colorObj ? (
                    <div className="px-2 py-1 bg-gray-100 rounded-md text-sm flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300" 
                        style={{ backgroundColor: colorObj.hexCode }}
                      ></div>
                      {colorObj.name}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Sizes with proper selection and stock management */}
        <div>
          <label htmlFor="sizes" className="block text-sm font-medium">Sizes</label>
          <select
            id="sizes"
            multiple
            value={selectedSizes}
            onChange={handleSizeChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            {sizes.map((size) => (
              <option key={size._id} value={size._id}>
                {size.name}
              </option>
            ))}
          </select>
          
          {/* Display selected sizes with stock inputs */}
          {selectedSizes.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Size Stock Management:</p>
              <div className="grid grid-cols-3 gap-4">
                {selectedSizes.map(sizeId => {
                  const sizeObj = sizes.find(s => s._id === sizeId);
                  // Get stock for this size using the helper function
                  const currentStock = getSizeStock(sizeId);
                  
                  return sizeObj ? (
                    <div key={sizeId} className="border rounded-md p-3">
                      <div className="font-medium mb-1">{sizeObj.name}</div>
                      <div className="flex items-center">
                        <label className="mr-2 text-sm">Stock:</label>
                        <input
                          type="number"
                          min="0"
                          value={currentStock}
                          onChange={(e) => handleStockChange(sizeId, e.target.value)}
                          className="p-1 border border-gray-300 rounded-md w-20 text-sm"
                        />
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

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

        <div>
          <label htmlFor="rating" className="block text-sm font-medium">Rating</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

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

        <button
          type="submit"
          className="w-full mt-6 py-2 bg-blue-500 text-white font-bold rounded-md"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;