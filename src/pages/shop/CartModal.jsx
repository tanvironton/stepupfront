/* eslint-disable react/prop-types */

import OrderSummary from "./OrderSummary";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../../redux/features/cart/cartSlice";
import { X } from "lucide-react";

const CartModal = ({ products, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleUpdateQuantity = (type, id) => {
    const payload = { type, id };
    dispatch(updateQuantity(payload));
  };

  const handleRemoveFromCart = (e, id) => {
    e.preventDefault();
    dispatch(removeFromCart({ id }));
  };
console.log(products)
  return (
    <>
      <div
        onClick={() => onClose()}
        className={`fixed z-[1000] inset-0 bg-black bg-opacity-50 origin-right transition-opacity ${
          isOpen ? "cartOpen" : "cartClose"
        }`}
      >
        <div
          className={`fixed flex flex-col justify-between right-0 top-0 md:w-[24%] w-full bg-white h-full overflow-y-auto transition-transform `}
          style={{
            transition: "transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
       <div className="p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold">Your Cart</h4>
        <button
          onClick={() => onClose()}
          className="text-gray-600 hover:text-gray-900"
        >
          <X />
        </button>
      </div>
      <div className="cart-items mb-5">
        {products?.length === 0 ? (
          <p className="flex justify-center mt-10">Your cart is empty.</p>
        ) : (
          products?.map((product, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row  md:justify-between  p-2 mb-4"
            >
              <div className="flex items-center w-[80%]">
                <img
                  src={product.image}
                  alt="image"
                  className="w-24 h-24 object-cover mr-4"
                />
                <div className="flex flex-col gap-2">
                  <h5 className="text-lg font-medium">{product?.name}</h5>
                  
                  <div className="flex">

                    {/* <p className="font-bold mr-1">Qty : </p> */}
                  <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateQuantity("decrement", product?._id);
                  }}
                  className="size-6 flex items-center justify-center px-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
                >
                  -
                </button>
                <span className="px-2 text-center mx-1">
                  {product?.quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateQuantity("increament", product?._id);
                  }}
                  className="size-6 flex items-center justify-center px-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
                >
                  +
                </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:justify-start justify-end items-center mt-2 w-[20%]">
                
                <div className="ml-5 flex flex-col gap-7">
                <p className="text-gray-600 font-bold text-sm">
                    ৳ {Math.round(product.price)}
                  </p>
                  <button
                    onClick={(e) => handleRemoveFromCart(e, product?._id)}
                    className="text-red-500 hover:text-red-700 mr-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
          {products?.length > 0 && <OrderSummary />}
        </div>
        
      </div>
      
    </>
  );
};

export default CartModal;
