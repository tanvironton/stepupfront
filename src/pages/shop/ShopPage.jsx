import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ProductCards from './ProductCards';
import { getBaseUrl } from '@/utils/getBaseUrl';

const ShopPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get category from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');

  // State for filters
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [priceRange, setPriceRange] = useState([100, 10000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state true while fetching
        const categoryRes = await axios.get(`${getBaseUrl()}/api/categories`);
        const productRes = await axios.get(`${getBaseUrl()}/api/products`);
        
        setCategories(categoryRes.data.data);
        setProducts(productRes.data.data.products);
        setFilteredProducts(productRes.data.data.products); // Set filtered products initially to all products
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading state false when fetching completes
      }
    };

    fetchData();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategories.length > 0) {
      selectedCategories.forEach(cat => {
        params.append('category', cat);
      });
    }
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedCategories, searchTerm, location.pathname]);

  // Toggle category selection
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([100, 10000]);
    setSearchTerm('');
    
    // Clear URL params when filters are reset
    navigate('/shop');
  };

  // Filter products based on selected filters
  useEffect(() => {
    const filtered = products.filter((product) => {
      // Filter by category
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category?.['_id']); // Use optional chaining

      // Filter by price range
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      // Filter by search term (name, description)
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });

    setFilteredProducts(filtered);  // Update the filtered products state
  }, [products, selectedCategories, priceRange, searchTerm]); // Re-run filter whenever products or filters change

  // Handle Add to Cart
  const handleAddToCart = (_id) => {
    console.log(_id);
    navigate(`/shop/${_id}`);
    // Add to cart logic goes here
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="mx-auto relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-500"
          />
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              {/* Price Range Filter */}
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Price Range</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded-sm text-xs">
                    &#x9F3; {priceRange[0]}
                  </span>
                  <span className="bg-green-600 text-white px-2 py-1 rounded-sm text-xs">
                    &#x9F3; {priceRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-1 bg-green-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Categories</h2>
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`category-${category._id}`}
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => toggleCategory(category._id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`category-${category._id}`} className="ml-2 text-sm font-medium text-gray-700">
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={resetFilters}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Reset filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full object-cover"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-black text-white text-sm py-1 px-2 rounded-lg">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base text-center font-bold mb-1 h-12 overflow-hidden">
                        {product.name.length > 25 ? product.name.slice(0, 20) + '...' : product.name}
                      </h3>
                      <div className="flex justify-center items-center mb-4">
                        {product.oldPrice > 0 && product.oldPrice !== null && (
                          <span className="text-gray-400 line-through mr-2">&#x9F3; {product.oldPrice}</span>
                        )}
                        <span className="font-semibold">&#x9F3; {product.price}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-3 text-gray-500 py-8">No products found. Try adjusting your filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;