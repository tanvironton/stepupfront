import React, { useState, useEffect } from 'react';
import Loading from '../../../../components/Loading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserReviews = () => {
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderProducts = async () => {
      if (!user?._id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5100/api/orders/user/${user._id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        
        // Process products to ensure uniqueness by productId
        const productMap = new Map();
        
        if (data.data && data.data.length > 0) {
          data.data.forEach(order => {
            if (order.products && order.products.length > 0) {
              order.products.forEach(product => {
                const productId = product.productId?._id;
                
                if (productId && !productMap.has(productId)) {
                  productMap.set(productId, {
                    ...product,
                    lastOrderId: order.orderId,
                    purchaseDate: order.createdAt
                  });
                }
              });
            }
          });
        }
        
        setUniqueProducts(Array.from(productMap.values()));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderProducts();
  }, [user]);

  const handleShopClick = () => {
    navigate("/shop");
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-8">
  <p className="text-lg mb-4">You haven't purchased any products yet.</p>
  <button 
    onClick={handleShopClick}
    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
  >
    Browse Products
  </button>
</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Review Products</h1>
      
      {uniqueProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">You haven't purchased any products yet.</p>
          <button 
            onClick={handleShopClick}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Purchase</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uniqueProducts.map((product) => (
                <tr key={product.productId?._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img 
                          className="h-12 w-12 rounded-md object-cover" 
                          src={product.productId?.image || "/placeholder-image.jpg"} 
                          alt={product.productId?.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.productId?.name}</div>
                        
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${product.productId?.price?.toFixed(2) || '0.00'}</div>
                    {product.productId?.discount > 0 && (
                      <div className="text-xs text-gray-500 line-through">${product.productId?.oldPrice?.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(product.purchaseDate).toLocaleDateString()}</div>
                    <div className="text-xs">Order Id: {product.lastOrderId.slice(0,6)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    
                    <button 
                      onClick={() => navigate(`/shop/${product.productId?._id}`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6">
        <button 
          onClick={handleShopClick}
          className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <span className="text-xl">+</span>
          <span>Shop More Products</span>
        </button>
      </div>
    </div>
  );
};

export default UserReviews