import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UserStats = ({ stats }) => {
    const [coinSettings, setCoinSettings] = useState([]);
  const { user } = useSelector(state => state.auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchCoinSettings();
  }, []);

  const fetchCoinSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5100/api/coin/');
      
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
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5100/api/auth/users/${user?._id }`);
        setUserData(response.data.data);
        console.log(response.data.data)
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?._id]);

  return (
    <div className="my-5 space-y-4">
      {error && <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>}
      {loading ? (
        <div className="flex justify-center p-6">
          <p className="text-gray-500">Loading user data...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200">
            <h2 className="text-xl font-semibold mb-2">Total Payments</h2>
            <p className="text-2xl font-bold">৳ {Math.round(stats?.totalPayments || 0)}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200">
            <h2 className="text-xl font-semibold mb-2">Total Reviews</h2>
            <p className="text-2xl font-bold">{stats?.totalReviews || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200">
            <h2 className="text-xl font-semibold mb-2">Purchased Products</h2>
            <p className="text-2xl font-bold">{stats?.totalPurchadedProducts || 0}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:border-primary cursor-pointer hover:scale-105 transition-all duration-200">
            <h2 className="text-sm font-semibold mb-2">Total Coins : {userData?.coin || user?.coin || 0}</h2>
            <p className="text-sm font-semibold mb-2">Per coin price :৳ {coinSettings.length > 0 ? coinSettings[0].pricePerCoin : 0} </p>
            <h2 className="text-base font-semibold ">
  Total Coins Price: ৳ {(userData?.coin || user?.coin || 0) * (coinSettings.length > 0 ? coinSettings[0].pricePerCoin :0 )}
</h2> 
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;