import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CoinSettingsManager = () => {
  const [coinSettings, setCoinSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [formData, setFormData] = useState({
    pricePerCoin: 0,
    minimumOrderAmount: 0
  });
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

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

  const handleEdit = (setting) => {
    setCurrentSetting(setting);
    setFormData({
      pricePerCoin: setting.pricePerCoin,
      minimumOrderAmount: setting.minimumOrderAmount
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentSetting || !currentSetting._id) {
      setUpdateMessage({ type: 'error', text: 'No setting ID available for update' });
      return;
    }
    
    try {
      setUpdating(true);
      setUpdateMessage(null);
      
      const response = await axios.put(
        `http://localhost:5100/api/coin/update/${currentSetting._id}`,
        formData
      );
      
      if (response.data && response.status === 200) {
        setUpdateMessage({ type: 'success', text: 'Settings updated successfully!' });
        // Update the local state with the new values
        setCoinSettings(prevSettings => 
          prevSettings.map(setting => 
            setting._id === currentSetting._id 
              ? { ...setting, ...formData } 
              : setting
          )
        );
        
        // Close modal after a delay
        setTimeout(() => {
          setShowModal(false);
          setUpdateMessage(null);
          // Refresh data from server
          fetchCoinSettings();
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      setUpdateMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update settings' 
      });
    } finally {
      setUpdating(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('BDT', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Coin Settings</h1>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="py-3 px-4 text-left">Price Per Coin</th>
              <th className="py-3 px-4 text-left">Minimum Order</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {coinSettings.length > 0 ? (
              coinSettings.map((setting, index) => (
                <tr key={setting._id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 border-b">{formatCurrency(setting.pricePerCoin)}</td>
                  <td className="py-3 px-4 border-b">{(setting.minimumOrderAmount)}</td>
                  <td className="py-3 px-4 border-b text-center">
                    <button
                      onClick={() => handleEdit(setting)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-6 px-4 text-center text-gray-500">
                  No coin settings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Coin Settings</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {updateMessage && (
              <div className={`mb-4 p-3 rounded ${updateMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {updateMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pricePerCoin">
                  Price Per Coin
                </label>
                <input
                  type="number"
                  id="pricePerCoin"
                  name="pricePerCoin"
                  value={formData.pricePerCoin}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minimumOrderAmount">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  id="minimumOrderAmount"
                  name="minimumOrderAmount"
                  value={formData.minimumOrderAmount}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center ${updating ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : 'Update Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinSettingsManager;