import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Check } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { getBaseUrl } from "@/utils/getBaseUrl";

function CoinPaymentOption({ totalAmount, onApplyCoin, disabled = false }) {
  const [coinSettings, setCoinSettings] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coinApplied, setCoinApplied] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  // Fetch coin settings and user data when component mounts
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

  const coinValue = calculateCoinValue();
  const canUseCoin = coinValue > 0 && totalAmount === coinValue;

  // Handle applying coins to the purchase
  const handleApplyCoin = async () => {
    if (!canUseCoin || !user?._id) {
      toast.error("Cannot apply coins to this purchase");
      return;
    }

    try {
      // Call the callback function to apply coins in the parent component
      onApplyCoin(coinValue);
      setCoinApplied(true);
      toast.success("Coins applied successfully!");
    } catch (error) {
      toast.error("Failed to apply coins");
      console.error("Error applying coins:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading coin information...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading coin data: {error}</div>;
  }

  if (!userData || !userData.coin) {
    return null; // Don't show this section if user has no coins
  }

  return (
    <div className="mt-6 border p-4 rounded-md">
      <h3 className="text-base font-semibold mb-3">Pay with Coins</h3>
      
      <div className="flex justify-between items-center mb-2">
        <span>Your Coins Balance:</span>
        <span className="font-medium">{userData.coin} coins</span>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span>Coin Value:</span>
        <span className="font-medium">TK {coinValue}</span>
      </div>
      
      {canUseCoin ? (
        <div className="flex justify-between items-center">
          <span>Matching exact order total!</span>
          <button
            onClick={handleApplyCoin}
            disabled={disabled || coinApplied}
            className={`px-4 py-2 rounded-md text-sm ${
              coinApplied || disabled
                ? "bg-gray-300 text-gray-600"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {coinApplied ? (
              <span className="flex items-center">
                <Check size={16} className="mr-1" /> Applied
              </span>
            ) : (
              "Apply Coins"
            )}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Coins can only be applied when their value exactly matches your order total.
          {userData.coin > 0 && 
            ` Your ${userData.coin} coins are worth TK ${coinValue}.`}
        </p>
      )}
    </div>
  );
}

export default CoinPaymentOption;