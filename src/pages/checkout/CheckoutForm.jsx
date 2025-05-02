import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Coins } from "lucide-react";

const checkoutFormSchema = z.object({
  first_name: z.string().min(1, "Name is required"),
  last_name: z.string(),
  email: z.string().email("Email is not valid!"),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
  address_line: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string(),
  paymentMethod: z.enum(["cod", "sslcommerz", "coin"], {
    required_error: "Please select a payment method",
  }),
  couponCode: z.string().optional(),
  coinsToApply: z.string().optional(),
});

function CheckoutForm({ 
  onCheckout, 
  applyCoupon,
  applyCoins,
  totalPrice = 0,
  userData = null,
  coinValue = 0,
  hasEnoughCoins = false,
  toggleCoinPayment,
  appliedCoins = 0,
  coinDiscount = 0
}) {
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  const [coinsApplied, setCoinsApplied] = useState(false);
  const [coinMessage, setCoinMessage] = useState("");
  const [coinStatus, setCoinStatus] = useState("");

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address_line: "",
      city: "",
      state: "",
      postalCode: "",
      paymentMethod: "cod",
      couponCode: "",
      coinsToApply: ""
    },
  });
  
  const watchPaymentMethod = watch("paymentMethod");

  // Update toggleCoinPayment when payment method changes
  const handlePaymentMethodChange = (method) => {
    setValue("paymentMethod", method);
    if (method === "coin") {
      toggleCoinPayment(true);
    } else {
      toggleCoinPayment(false);
    }
  };

  const onSubmit = async (data) => {
    await onCheckout(data);
  };

  const handleApplyCoupon = async () => {
    const couponCode = getValues("couponCode");
    if (!couponCode) {
      setCouponMessage("Please enter a coupon code");
      setCouponStatus("error");
      return;
    }

    try {
      const result = await applyCoupon(couponCode);
      if (result.success) {
        setCouponMessage("Coupon applied successfully!");
        setCouponStatus("success");
        setCouponApplied(true);
      } else {
        setCouponMessage(result.message || "Invalid coupon code");
        setCouponStatus("error");
        setCouponApplied(false);
      }
    } catch (error) {
      setCouponMessage("Error applying coupon");
      setCouponStatus("error");
      setCouponApplied(false);
    }
  };

  // Handle applying coins
 // In CheckoutForm.jsx, update the handleApplyCoins function:

// In CheckoutForm.jsx, update the handleApplyCoins function:

// In CheckoutForm.jsx, update the handleApplyCoins function:
const handleApplyCoins = async () => {
  const coinsInputValue = getValues("coinsToApply");
  const coinsToApply = parseInt(coinsInputValue, 10);
  
  // Clear any previous messages
  setCoinMessage("");
  setCoinStatus("");
  
  // Validate input
  if (!coinsInputValue || isNaN(coinsToApply) || coinsToApply <= 0) {
    setCoinMessage("Please enter a valid number of coins");
    setCoinStatus("error");
    return;
  }

  if (!userData) {
    setCoinMessage("User data is not available");
    setCoinStatus("error");
    return;
  }

  if (coinsToApply > userData.coin) {
    setCoinMessage(`You only have ${userData.coin} coins available`);
    setCoinStatus("error");
    return;
  }

  try {
    // Show loading state
    setCoinMessage("Applying coins...");
    setCoinStatus("loading");
    
    const result = await applyCoins(coinsToApply);
    
    if (result.success) {
      setCoinMessage(`${coinsToApply} coins applied (TK ${result.discountAmount})`);
      setCoinStatus("success");
      setCoinsApplied(true);
      
      // Update the input field to be disabled
      setValue("coinsToApply", coinsToApply.toString());
    } else {
      setCoinMessage(result.message || "Failed to apply coins");
      setCoinStatus("error");
      setCoinsApplied(false);
    }
  } catch (error) {
    setCoinMessage("Error applying coins");
    setCoinStatus("error");
    setCoinsApplied(false);
  }
};

  return (
    <div className="font-[sans-serif] bg-white">
      <div className="flex max-sm:flex-col gap-12 max-lg:gap-4 h-full">
        <div className="max-w-4xl w-full h-max rounded-md px-4 py-5 sticky top-0">
          <h2 className="text-2xl font-bold text-gray-800">
            Complete your order
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <div>
              <h3 className="text-base text-gray-800 mb-4">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="First Name"
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                      />
                    )}
                  />
                  <p className="text-red-400 px-1">
                    {errors?.first_name?.message}
                  </p>
                </div>
                <div>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Last Name"
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                      />
                    )}
                  />
                  <p className="text-red-400 px-1">
                    {errors?.last_name?.message}
                  </p>
                </div>
                <div>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        placeholder="Email"
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                      />
                    )}
                  />
                  <p className="text-red-400 px-1">
                    {errors?.email?.message}
                  </p>
                </div>
                <div>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        placeholder="Phone Number (11 digits)"
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                      />
                    )}
                  />
                  <p className="text-red-400 px-1">
                    {errors?.phone?.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base text-gray-800 mb-4">Shipping Address</h3>
              <div className="grid gap-4">
                <div>
                  <Controller
                    name="address_line"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Address"
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                      />
                    )}
                  />
                  <p className="text-red-400 px-1">
                    {errors?.address_line?.message}
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="City"
                          className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                        />
                      )}
                    />
                    <p className="text-red-400 px-1">
                      {errors?.city?.message}
                    </p>
                  </div>
                  <div>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="State/Province"
                          className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                        />
                      )}
                    />
                    <p className="text-red-400 px-1">
                      {errors?.state?.message}
                    </p>
                  </div>
                  <div>
                    <Controller
                      name="postalCode"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Postal Code"
                          className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                        />
                      )}
                    />
                    <p className="text-red-400 px-1">
                      {errors?.postalCode?.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base text-gray-800 mb-4">Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className={`border ${watchPaymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-200'} rounded-md p-4 cursor-pointer`}
                  onClick={() => handlePaymentMethodChange('cod')}
                >
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="radio"
                        value="cod"
                        checked={watchPaymentMethod === 'cod'}
                        onChange={() => {}}
                        className="hidden"
                      />
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full border ${watchPaymentMethod === 'cod' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}></span>
                    <span className="text-gray-800">Cash on Delivery</span>
                  </div>
                </div>
                <div 
                  className={`border ${watchPaymentMethod === 'sslcommerz' ? 'border-blue-600' : 'border-gray-200'} rounded-md p-4 cursor-pointer`}
                  onClick={() => handlePaymentMethodChange('sslcommerz')}
                >
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="radio"
                        value="sslcommerz"
                        checked={watchPaymentMethod === 'sslcommerz'}
                        onChange={() => {}}
                        className="hidden"
                      />
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full border ${watchPaymentMethod === 'sslcommerz' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}></span>
                    <span className="text-gray-800">SSLCommerz</span>
                  </div>
                </div>
                {userData && userData.coin > 0 && (
                  <div 
                    className={`border ${watchPaymentMethod === 'coin' ? 'border-blue-600' : 'border-gray-200'} rounded-md p-4 cursor-pointer ${!hasEnoughCoins ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => hasEnoughCoins && handlePaymentMethodChange('coin')}
                  >
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="radio"
                          value="coin"
                          checked={watchPaymentMethod === 'coin'}
                          onChange={() => {}}
                          className="hidden"
                          disabled={!hasEnoughCoins}
                        />
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span className={`h-4 w-4 rounded-full border ${watchPaymentMethod === 'coin' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}></span>
                      <span className="flex items-center text-gray-800">
                        <Coins size={16} className="mr-1" />
                        Pay with Coins
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-red-400 px-1 mt-1">
                {errors?.paymentMethod?.message}
              </p>
            </div>

            {/* Coupon Code Section */}
            <div className="mt-8">
              <h3 className="text-base text-gray-800 mb-4">Coupon Code</h3>
              <div className="flex gap-3">
                <div className="w-full">
                  <Controller
                    name="couponCode"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter coupon code"
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                        disabled={couponApplied}
                      />
                    )}
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                  className={`px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 ${couponApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponMessage && (
                <p className={`mt-2 px-1 ${couponStatus === 'error' ? 'text-red-400' : 'text-green-500'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            {/* Coin Section */}
           {/* Coin Section */}
{userData && userData.coin > 0 && watchPaymentMethod !== 'coin' && (
  <div className="mt-8">
    <h3 className="text-base text-gray-800 mb-4">Apply Coins</h3>
    <div className="flex gap-3">
      <div className="w-full">
        <Controller
          name="coinsToApply"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              placeholder={`Available: ${Math.round(userData.coin)} coin = TK ${Math.round(coinValue)})`}
              className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
              disabled={coinsApplied}
              max={userData.coin}
            />
          )}
        />
      </div>
      <button 
        type="button"
        onClick={handleApplyCoins}
        disabled={coinsApplied}
        className={`px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 ${coinsApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {coinsApplied ? 'Applied' : 'Apply'}
      </button>
    </div>
    {coinMessage && (
      <p className={`mt-2 px-1 ${coinStatus === 'error' ? 'text-red-400' : 'text-green-500'}`}>
        {coinMessage}
      </p>
    )}
    
  </div>
)}

           

            <div className="mt-8">
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-all"
              >
                Complete Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;