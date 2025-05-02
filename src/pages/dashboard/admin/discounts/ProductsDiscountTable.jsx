import React, { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import { useFetchAllProdutsQuery } from "@/redux/features/products/productsApi";

import { 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  DollarSign, 
  PercentIcon, 
  Search, 
  RefreshCw,
  Filter,
  X
} from "lucide-react";
import ProductDiscountModal from "./ProductDiscountModal";

function ProductsDiscountTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    data: productsData = {},
    error,
    isLoading,
    refetch,
  } = useFetchAllProdutsQuery({
    category: "",
    color: "",
    minPrice: "",
    maxPrice: "",
    page: currentPage,
    limit: productsPerPage,
  });

  useEffect(() => {
    if (productsData?.data?.products) {
      if (searchTerm) {
        const filtered = productsData.data.products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(productsData.data.products);
      }
    }
  }, [searchTerm, productsData?.data?.products]);

  if (isLoading) return <Loading />;

  const { products, totalProducts, totalPages } = productsData?.data || {};
  const displayProducts = searchTerm ? filteredProducts : products;

  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = startProduct + products?.length - 1;

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSearchTerm("");
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  // Function to generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    // Always show first page
    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded-md mx-1 text-sm md:text-base ${
          currentPage === 1
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        1
      </button>
    );

    // Calculate range of buttons to show
    let startPage = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisibleButtons - 3);
    
    if (startPage > 2) {
      buttons.push(<span key="ellipsis1" className="mx-1">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md mx-1 text-sm md:text-base ${
            currentPage === i
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis2" className="mx-1">...</span>);
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded-md mx-1 text-sm md:text-base ${
            currentPage === totalPages
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };
  
  let x1=0;
  
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header with search */}
          <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Product Discount Management
                </h1>
                <p className="mt-1 text-indigo-100">
                  Manage discounts for {totalProducts} products
                </p>
              </div>
              
              <div className="relative w-full md:w-64">
                <div className={`relative flex items-center rounded-lg overflow-hidden transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-white' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-indigo-200" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="block w-full pl-10 pr-10 py-2 border-0 bg-indigo-500/30 placeholder-indigo-200 text-white focus:outline-none focus:ring-0"
                  />
                  {searchTerm && (
                    <button 
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-4 w-4 text-indigo-200 hover:text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2 text-indigo-500" />
              <span>
                Showing {displayProducts?.length > 0 ? startProduct : 0} to {endProduct} of {totalProducts} products
              </span>
              {searchTerm && (
                <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">
                  Search results: {filteredProducts.length}
                </span>
              )}
            </div>
            
            <button 
              onClick={() => refetch()}
              className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-indigo-500" />
                      Old Price
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    <div className="flex items-center">
                      <PercentIcon className="h-4 w-4 mr-1 text-indigo-500" />
                      Discount
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1 text-indigo-500" />
                      Sale Price
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayProducts?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.image && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img 
                              className="h-10 w-10 rounded-md object-cover border border-gray-200" 
                              src={item.image} 
                              alt={item.name} 
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40?text=NA';
                              }}
                            />
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      {item?.discount > 0 ? (
                        <span className="text-sm font-medium text-black ">
                           ৳ {Math.round(item?.oldPrice)}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-gray-400">
                           ৳ {x1}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        item?.discount > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item?.discount}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-indigo-600"> ৳ {Math.round(item?.price)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                      >
                        Set Discount
                      </button>
                    </td>
                  </tr>
                ))}
                {!displayProducts?.length && (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <Tag className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg font-medium">No products found</p>
                        {searchTerm && (
                          <p className="text-gray-400 text-sm mt-1">
                            Try a different search term or clear filters
                          </p>
                        )}
                        {searchTerm && (
                          <button 
                            onClick={clearSearch}
                            className="mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-medium rounded-md transition-colors"
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && !searchTerm && (
            <div className="px-6 py-4 flex flex-wrap justify-center items-center border-t border-gray-200 bg-white">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md mr-2 flex items-center text-sm ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              <div className="flex overflow-x-auto py-1 hide-scrollbar">
                {renderPaginationButtons()}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-md ml-2 flex items-center text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Manage product discounts effectively to boost sales and clear inventory
        </div>
      </div>

      {/* Update Order Modal */}
      {selectedItem && (
        <ProductDiscountModal
          type="product"
          refetch={refetch}
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      
      {/* Add a bit of custom CSS for the scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ProductsDiscountTable;