import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";

function ProductCard({ item }) {
  const {
    _id,
    name,
    price,
    discount,
    oldPrice,
    image,
    gallery,
  } = item || {};
  
  const navigate = useNavigate();
  const [hoverState, setHoverState] = useState(false);
  
  const handleAddToCart = () => {
    navigate(`/shop/${_id}`);
    // If you have a cart state manager, uncomment:
    // dispatch(addToCart({ ...item }));
  };
  
  return (
    <div 
      className="shadow-lg rounded-lg overflow-hidden product-card group"
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      {/* Image Section */}
      <div className="relative">
        <Link to={`/shop/${_id}`}>
          <div className="overflow-hidden">
            <img
              src={hoverState ? (gallery[1] ? gallery[1] : image) : image}
              alt={name}
              className="w-full h-[300px] object-cover object-top transition-all duration-300"
            />
          </div>
        </Link>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-0 left-0 p-2">
            <span className="bg-black text-white font-semibold text-sm py-1 px-3 rounded-full">
              {discount}%
            </span>
          </div>
        )}
      </div>
      
      {/* Product Details Section */}
      <div className="p-4">
        <Link to={`/shop/${_id}`}>
          <h3 className="text-sm text-center font-semibold">
            {name.length > 20 ? name.slice(0, 40) + '...' : name}
          </h3>
        </Link>
        
        {/* Price Section */}
        <div className="flex items-center justify-center space-x-2 mt-2">
        
        {oldPrice > 0 && (
          <del className="text-gray-400">&#x9F3;{Math.round(oldPrice)}</del>
        )}
         
          
          <span className="text-gray-800 text-xl">
            &#x9F3;{Math.round(price)}
          </span>
        </div>
        
        {/* Shop Now Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;