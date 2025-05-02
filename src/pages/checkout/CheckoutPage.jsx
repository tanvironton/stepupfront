import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Check, Coins } from "lucide-react";
import { updateQuantity, clearCart } from "@/redux/features/cart/cartSlice";
import CheckoutForm from "./CheckoutForm";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getBaseUrl } from "@/utils/getBaseUrl";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function CheckoutPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentTime, setPaymentTime] = useState(null);
  const [coinSettings, setCoinSettings] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCoinPayment, setUseCoinPayment] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [appliedCoins, setAppliedCoins] = useState(0);
  const [coinDiscount, setCoinDiscount] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();

  // Effect to show sweet alert when payment is confirmed
  useEffect(() => {
    if (paymentConfirmed && paymentTime) {
      Swal.fire({
        title: 'Payment Confirmed!',
        html: `
          <div class="text-center">
            <p class="mb-2">Your payment was successfully processed.</p>
            <p class="text-sm text-gray-600">Payment time: ${paymentTime}</p>
            ${coinsEarned > 0 ? `<p class="text-sm text-yellow-600 mt-2">You earned ${coinsEarned} coins!</p>` : ''}
          </div>
        `,
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: 'Continue',
        confirmButtonColor: '#4F46E5'
      });
    }
  }, [paymentConfirmed, paymentTime, coinsEarned]);

  // Fetch coin settings and user data
  useEffect(() => {
    fetchCoinSettings();
    if (user?._id) {
      fetchUserData();
    }
  }, [user?._id]);

  const fetchCoinSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getBaseUrl()}/api/coin/`);
      
      const data = response.data.data;
      if (data && !Array.isArray(data)) {
        if (data.settings && Array.isArray(data.settings)) {
          setCoinSettings(data.settings);
        } else {
          setCoinSettings([data]);
        }
      } else if (Array.isArray(data)) {
        setCoinSettings(data);
      } else {
        setCoinSettings([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching coin settings:", err);
      setError(err.message || "Failed to fetch data");
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getBaseUrl()}/api/auth/users/${user?._id}`);
      setUserData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  // Calculate coin value based on pricePerCoin setting
  const calculateCoinValue = () => {
    if (!coinSettings || coinSettings.length === 0 || !userData) return 0;
    
    const setting = coinSettings[0]; // Get the first coin setting
    const pricePerCoin = setting.pricePerCoin || 1;
    return userData.coin * pricePerCoin;
  };

  // Calculate order total
  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  const totalBeforeDiscount = calculateTotal();
  const totalAfterCouponDiscount = totalBeforeDiscount - discount;
  const totalAfterAllDiscounts = totalAfterCouponDiscount - coinDiscount;
  const coinValue = calculateCoinValue();
  const hasEnoughCoins = coinValue >= totalAfterCouponDiscount;

  // New function to apply coins as partial payment
  // const applyCoins = async (coinsToApply) => {
  //   try {
  //     if (!user?._id || !coinsToApply || coinsToApply <= 0) {
  //       return { success: false, message: "Invalid coin amount" };
  //     }

  //     const response = await axios.post(
  //       `${getBaseUrl()}/api/orders/apply-coins`,
  //       {
  //         userId: user._id,
  //         coins: coinsToApply,
  //         orderAmount: totalAfterCouponDiscount
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       const appliedDiscount = response.data.discountAmount || 0;
  //       setAppliedCoins(coinsToApply);
  //       setCoinDiscount(appliedDiscount);
  //       return { 
  //         success: true, 
  //         message: `${coinsToApply} coins applied successfully!`,
  //         discountAmount: appliedDiscount
  //       };
  //     } else {
  //       return { 
  //         success: false, 
  //         message: response.data.message || "Failed to apply coins" 
  //       };
  //     }
  //   } catch (error) {
  //     console.error("Error applying coins:", error);
  //     return { 
  //       success: false, 
  //       message: error.response?.data?.message || "Error applying coins" 
  //     };
  //   }
  // };

 // Update the applyCoins function in CheckoutPage.jsx
// In the applyCoins function in CheckoutPage.jsx
const applyCoins = async (coinsToApply) => {
  try {
    if (!user?._id || !coinsToApply || coinsToApply <= 0) {
      return { success: false, message: "Invalid coin amount" };
    }

    // Create a detailed payload with all required fields
    const payload = {
      userId: user._id,
      // Make sure these values are numbers, not strings
      coins: parseInt(coinsToApply, 10),
      orderAmount: parseFloat(totalAfterCouponDiscount)
    };

    console.log("Sending payload:", payload); // Debug log

    const response = await axios.post(
      `${getBaseUrl()}/api/orders/apply-coins`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      const appliedDiscount = response.data.discountAmount || 0;
      setAppliedCoins(parseInt(coinsToApply, 10));
      setCoinDiscount(appliedDiscount);
      
      // Update the user's coin balance in the state IMMEDIATELY
      if (userData) {
        // Convert to numbers to avoid string concatenation
        const coinsToApplyNum = parseInt(coinsToApply, 10);
        const currentCoinsNum = parseInt(userData.coin, 10);
        
        setUserData({
          ...userData,
          coin: currentCoinsNum - coinsToApplyNum
        });
      }
      
      return { 
        success: true, 
        message: `${coinsToApply} coins applied successfully!`,
        discountAmount: appliedDiscount,
        remainingCoins: userData ? userData.coin - parseInt(coinsToApply, 10) : 0
      };
    } else {
      return { 
        success: false, 
        message: response.data.message || "Failed to apply coins" 
      };
    }
  } catch (error) {
    console.error("Error applying coins:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Error applying coins" 
    };
  }
};

  // Toggle coin payment method
  const toggleCoinPayment = (value) => {
    setUseCoinPayment(value);
    // If we're switching from coin payment to another method, reset the applied coins
    if (!value && appliedCoins > 0) {
      setAppliedCoins(0);
      setCoinDiscount(0);
    }
  };

  // Handle quantity update
  const handleUpdateQuantity = (type, id) => {
    const payload = { type, id };
    dispatch(updateQuantity(payload));
  };

  // Function to apply coupon code
  const applyCoupon = async (couponCode) => {
    if (!couponCode) {
      return { success: false, message: "Please enter a coupon code" };
    }
  
    try {
      const response = await axios.post(
        `${getBaseUrl()}/api/coupons/apply`,
        { 
          code: couponCode,
          userId: user?._id,
          amount: totalBeforeDiscount
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.finalAmount) {
        const discountAmount = response.data.discountAmount;
        setDiscount(discountAmount);
        // Store coupon ID if available
        if (response.data.couponId) {
          setCouponId(response.data.couponId);
        }
        return { success: true, message: "Coupon applied successfully!" };
      } else {
        return { success: false, message: response.data.error || "Invalid coupon code" };
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      return { 
        success: false, 
        message: error.response?.data?.error || "Error validating coupon" 
      };
    }
  };

  // Process coin payment - now using the specific endpoint
  const processCoinPayment = async (formData, products) => {
    try {
      // Prepare the data for coin payment
      const paymentData = {
        userId: user?._id,
        products: products.map(product => ({
          productId: product._id,
          quantity: product.quantity,
          price: product.price,
          size: product.size.name,
          color: product.color.hexCode
        })),
        email: formData.email,
        amount: totalAfterAllDiscounts,
        couponId: couponId,
        appliedCoins: appliedCoins,
        address: {
          addressLine: formData.address_line,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          fullName: `${formData.first_name} ${formData.last_name}`,
          phone: formData.phone
        }
      };

      // Call the new specific coin-order API endpoint
      const response = await axios.post(
        `${getBaseUrl()}/api/orders/create-coin-order`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Track coins earned for the confirmation message
        if (response.data.coinsEarned) {
          setCoinsEarned(response.data.coinsEarned);
        }
        
        // Update user data to reflect new coin balance
        setUserData({
          ...userData,
          coin: response.data.userCoinsRemaining
        });
        
        return {
          success: true,
          order: response.data.order
        };
      } else {
        toast.error(response.data.message || "Failed to process coin payment");
        return { success: false };
      }
    } catch (error) {
      console.error("Error processing coin payment:", error);
      const errorMessage = error.response?.data?.message || "Error processing coin payment";
      toast.error(errorMessage);
      return { success: false };
    }
  };

  // Process order after confirmation
  const processOrder = async (formData) => {
    try {
      // Structure general order data
      const orderData = {
        products: products,
        userId: user?._id,
        customer_info: {
          ...formData,
          address: formData.address_line,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          fullName: `${formData.first_name} ${formData.last_name}`,
          phone: formData.phone
        },
        discount: discount,
        coinDiscount: coinDiscount,
        appliedCoins: appliedCoins,
        totalAmount: totalAfterAllDiscounts,
        paymentMethod: formData.paymentMethod,
        couponCode: discount > 0 ? formData.couponCode : null,
        couponId: couponId
      };

      let response;

      // Process payment method-specific flow
      if (formData.paymentMethod === "coin") {
        // Use the dedicated coin payment processor
        const coinResult = await processCoinPayment(formData, products);
        
        if (!coinResult.success) {
          setIsProcessing(false);
          return;
        }
        
        // Set success response data
        response = {
          data: {
            success: true,
            order: coinResult.order
          }
        };
      } else if (formData.paymentMethod === "cod") {
        // Handle Cash on Delivery
        response = await axios.post(`${getBaseUrl()}/api/orders/create-cod-order`, orderData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (formData.paymentMethod === "sslcommerz") {
        // Handle SSLCommerz Payment
        response = await axios.post(`${getBaseUrl()}/init`, orderData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response?.data?.url) {
          // Store a flag in session storage to show the alert upon return
          sessionStorage.setItem('paymentInitiated', 'true');
          sessionStorage.setItem('paymentTime', new Date().toLocaleString());
          window.location.replace(response?.data?.url);
          return;
        } else {
          toast.error("Payment initialization failed");
          setIsProcessing(false);
          return;
        }
      }

      if (response.data.success) {
        // Set payment confirmation time
        const currentTime = new Date().toLocaleString();
        setPaymentTime(currentTime);
        setPaymentConfirmed(true);
        
        setOrderDetails(response.data.order);
        setOrderPlaced(true);
        dispatch(clearCart());
        
        // Refresh user data if needed
        if (formData.paymentMethod === "coin" || appliedCoins > 0) {
          fetchUserData();
        }
        
        toast.success("Order placed successfully!");
        navigate("/success");
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error processing order:", error);
      // Show more detailed error message from the response if available
      console.log("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Error processing your order";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle order placement with confirmation
  const makePayment = async (formData) => {
    if (!user) {
      navigate(`/login?from=${pathname}`, { state: { from: "/checkout" } });
      return;
    }

    if (products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // If using coin payment, check if user has enough coins
    if (formData.paymentMethod === "coin") {
      if (!hasEnoughCoins) {
        toast.error("You don't have enough coins to complete this purchase");
        return;
      }
    }

    // Validate form data
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (!formData.address_line) {
      toast.error("Shipping address is required");
      return;
    }

    // Show confirmation SweetAlert
    Swal.fire({
      title: "Confirm Your Order",
      text: "Are you sure you want to place this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place order!",
      cancelButtonText: "No, review order"
    }).then((result) => {
      if (result.isConfirmed) {
        setIsProcessing(true);
        processOrder(formData);
      }
    });
  };

  // Check for returning payment on component mount
  useEffect(() => {
    const paymentInitiated = sessionStorage.getItem('paymentInitiated');
    if (paymentInitiated === 'true') {
      // Get the payment time from session storage
      const storedPaymentTime = sessionStorage.getItem('paymentTime');
      if (storedPaymentTime) {
        setPaymentTime(storedPaymentTime);
        setPaymentConfirmed(true);
      }
      // Clear the session storage
      sessionStorage.removeItem('paymentInitiated');
      sessionStorage.removeItem('paymentTime');
    }
  }, []);

  // If the order is placed successfully, show order confirmation
  if (orderPlaced && orderDetails) {
    return (
      <section className="p-5 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check size={40} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received.
          </p>
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order ID:</span>
              <span>{orderDetails._id || orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Payment Method:</span>
              <span>
                {orderDetails.paymentMethod === "cod" 
                  ? "Cash on Delivery" 
                  : orderDetails.paymentMethod === "coin"
                  ? "Coin Payment"
                  : "Online Payment"}
              </span>
            </div>
            {paymentTime && (
              <div className="flex justify-between mb-2">
                <span className="font-medium">Payment Time:</span>
                <span>{paymentTime}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span>TK {orderDetails.totalAmount || orderDetails.finalAmount}</span>
            </div>
            {coinsEarned > 0 && (
              <div className="flex justify-between mt-2 text-yellow-600">
                <span className="font-medium">Coins Earned:</span>
                <span>{coinsEarned} coins</span>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-5">
      <h2 className="text-2xl font-semibold text-center">Checkout</h2>
      <div className="grid md:grid-cols-12 gap-3 mt-5">
        <div className="md:col-span-6 border p-2">
          {/* Pass additional props to CheckoutForm */}
          <CheckoutForm 
            onCheckout={makePayment} 
            applyCoupon={applyCoupon}
            applyCoins={applyCoins}
            totalPrice={totalAfterAllDiscounts}
            userData={userData}
            coinValue={coinValue}
            hasEnoughCoins={hasEnoughCoins}
            toggleCoinPayment={toggleCoinPayment}
            appliedCoins={appliedCoins}
            coinDiscount={coinDiscount}
          />
        </div>

        <div className="md:col-start-7 md:col-span-6">
          <div className="border p-2 mb-5">
            <div className="flex flex-wrap justify-between gap-5">
              <span className="flex-grow basis-2/5">Product</span>
              <span className="flex-grow">Size</span>
              <span className="flex-grow">Color</span>
              <span className="flex-grow">Price</span>
              <span className="flex-grow">Quantity</span>
              <span className="flex-grow">Subtotal</span>
            </div>
            {products.map((product) => (
              <div
                className="flex flex-wrap gap-5 justify-between border border-t-1 border-b-0 border-l-0 border-r-0 p-2"
                key={product._id}
              >
                <span className="flex-grow basis-2/5">{product.name}</span>
                <span className="flex-grow">{product.size.name}</span>
                <span
                  style={{
                    backgroundColor: product.color.hexCode,
                  }}
                  className="h-5 w-5 rounded-sm"
                ></span>
                <span className="flex-grow">
                  tk {typeof product.price === "number" && Math.round( product?.price)}
                </span>
                <div className="flex-grow flex gap-5">
                  <button
                    onClick={() => handleUpdateQuantity("decrement", product._id)}
                    disabled={isProcessing}
                  >
                    <Minus size={15} />
                  </button>
                  <span>{product?.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity("increament", product?._id)}
                    disabled={isProcessing}
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span className="flex-grow">
                  {typeof product.price === "number" &&
                   Math.round( product?.price * product?.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border p-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>TK {Math.round(totalBeforeDiscount)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-TK {Math.round(discount)}</span>
                </div>
              )}
              {coinDiscount > 0 && (
                <div className="flex justify-between text-yellow-600">
                  <span>Coin Discount ({appliedCoins} coins)</span>
                  <span>-TK {Math.round(coinDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>TK 0</span>
              </div>
              {userData && (
  <div className="flex justify-between items-center py-2 bg-yellow-50 px-2 rounded-md">
    <div className="flex items-center gap-2">
      <Coins size={16} className="text-yellow-600" />
      <span className="font-medium">Your Coin Balance</span>
    </div>
    <span className="text-yellow-600 font-medium">
      {Math.round(userData.coin)} Coins 
      (TK {Math.round(userData.coin * (coinSettings[0]?.pricePerCoin || 1))})
    </span>
  </div>
)}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>TK {Math.round(totalAfterAllDiscounts)}</span>
                </div>
              </div>
              
              {userData && coinValue > 0 && (
                <div className="pt-2 border-t mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    {hasEnoughCoins 
                      ? "You have enough coins to complete this purchase!" 
                      : `You need ${Math.ceil((totalAfterCouponDiscount - coinValue) / (coinSettings[0]?.pricePerCoin || 1))} more coins to use full coin payment.`}
                  </p>
                  {useCoinPayment && hasEnoughCoins && (
                    <p className="text-sm text-yellow-600">
                      <span className="font-medium">You'll earn approximately {Math.floor(totalAfterAllDiscounts * 0.05)} coins</span> with this purchase!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;