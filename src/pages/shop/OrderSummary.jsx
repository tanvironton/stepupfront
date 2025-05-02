/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { Link } from "react-router-dom";

const OrderSummary = ({ page = "modal" }) => {
  const dispatch = useDispatch();
 

  // Select the cart state from Redux store
  const { products, selectedItems, totalPrice } = useSelector((state) => state.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Ensure selectedItems is a number (count of items)
  const numberOfItems = Array.isArray(products) ? products.length : selectedItems;

  // Proceed to checkout and pass selected products using `navigate`
  

  return (
    <>
    <div className="">
      <div className="px-6 py-4 space-y-5 bg-primary-light rounded text-base">
        <h1 className="text-2xl font-bold text-dark">Order Summary</h1>

        {/* ✅ Fix: Ensure selectedItems is a number */}
        <p className="text-dark mt-2">
          Selected Items: {numberOfItems}
        </p>

        {/* ✅ Fix: Ensure totalPrice is a number */}
        <p className="text-dark mt-2">
  Total Price: ৳ {Math.round(Number(totalPrice || 0))}
</p>


        <div className="p-2 mb-2 flex justify-center">
        {page !== "checkout" && (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearCart();
              }}
              className="bg-red-500 px-3 py-1.5 text-white rounded-md flex justify-between items-center"
            >
              <span className="mr-2">Clear Cart</span>
              <i className="ri-delete-bin-7-line"></i>
            </button>

            <Link to="/checkout" 
             
              className="bg-green-600 px-3 py-1.5 text-white rounded-md inline-flex justify-between items-center w-2/2"
            >
              Proceed Checkout
            </Link>
          </div>
        )}
      </div>
      </div>

     
    </div>
    </>
  );
};

export default OrderSummary;
