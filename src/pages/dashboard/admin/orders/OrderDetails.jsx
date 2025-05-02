import {
  useGetOrdersByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/orders/orderApi";
import { formatDate, getStatusColor, priceDisplay } from "@/utils";
import { getBaseUrl } from "@/utils/getBaseUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

 
  const [coinSettings, setCoinSettings] = useState(null);
console.log(coinSettings)
  const fetchCoinSettings = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/api/coin/`);
      const data = response.data.data;
      setCoinSettings(data.pricePerCoin);
    } catch (err) {
      console.error("Error fetching coin settings:", err);
    }
  };
  
  // Add useEffect to call fetchCoinSettings when component mounts
  useEffect(() => {
    fetchCoinSettings();
  }, []); // Empty dependency array means this runs once on mount
  const generateMaskedMasterCard = () => {
    const randomFour = () => Math.floor(1000 + Math.random() * 9000);
    const secondDigit = Math.floor(Math.random() * 10); // 0-9
    return `5${secondDigit}** **** ${randomFour()} ${randomFour()}`;
  };

  const { data, error, isLoading } = useGetOrdersByIdQuery(id);

  const order = data?.data || {};
  const { orderId, createdAt, status, payment_status,paymentMethod,discountAmount,finalAmount,amount } = order || {};
  const [currentStatus, setCurrentStatus] = useState("");

  // updateOrderStatus
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleUpdate = async (value) => {
    try {
      await updateOrderStatus({
        id,
        status: value,
        paymentStatus: payment_status,
      }).unwrap();
      // console.log(response)
      toast.success("Updated order status");
    } catch (error) {
      console.error(error);
    }
  };

  //updateOrderStatus
  useEffect(() => {
    if (!status) return;
    setCurrentStatus(status);
  }, [status]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto my-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <div>
            <select
              value={currentStatus}
              onChange={(e) =>
                setCurrentStatus(() => {
                  handleUpdate(e.target.value);
                  return e.target.value;
                })
              }
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="text-gray-600 text-sm mb-2">Order ID: {orderId.slice(0,6)}</div>
        <div className="text-gray-600 text-sm mb-4">
          {formatDate(createdAt)}
        </div>
        <span
          className={`${getStatusColor(
            status
          )}  text-white text-xs font-semibold px-2.5 py-0.5 rounded`}
        >
          {status}
        </span>
      </div>
      {/* Customer and Payment Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Customer</h2>
          <p>
            <strong>Name:</strong> {order?.userId?.username || "No user found"}
          </p>
          <p>
            <strong>Email:</strong>  {order?.email || "No user found"}
          </p>
          <p>
            
          </p>
        </div>
        {/* Order Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Info</h2>
          
          <p>
            <strong>Payment method:</strong>{paymentMethod}
          </p>
          <p>
            <strong>Status:</strong> Approved
          </p>
        </div>
        {/* Payment Info */}
        {paymentMethod !== "cod" && paymentMethod !== "coin" && (
     <div className="bg-white p-6 rounded-lg shadow-sm">
     <h2 className="text-lg font-semibold mb-4">Payment Info</h2>
     <p>
       <strong>Master Card:</strong> {generateMaskedMasterCard()}
     </p>
     <p>
       <strong>Business name:</strong> Maria Aniston
     </p>
     {/* <p>
       <strong>Phone:</strong> +1 (065) 786 55 67
     </p> */}
   </div>
)}

        {/* Notes */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type some note..."
            defaultValue={""}
          />
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
       

<div>

</div>

       <div className="mt-6">
       { paymentMethod == "coin" && (
     <div className="bg-white p-6 rounded-lg ">
     <h2 className="text-lg font-semibold mb-4">Payment Info</h2>
     <p>
  <strong>Used Total Coin: {(finalAmount)/(coinSettings)}</strong>
</p>
     
   </div>
)}
       {discountAmount === 0 ? (
  <p className="px-6">Final Amount:  ৳ {Math.round(finalAmount)}</p>
) : (
  <>
    <p className="px-6">Amount:  ৳ {Math.round(amount)}</p>
    <p className="px-6">Discount:  ৳ {discountAmount}</p>
    <p className="px-6">Final Amount: ৳ {Math.round(finalAmount)}</p>
  </>
)}
       </div>


      {/* Products */}
      <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Unit Price
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Quantity
              </th>{" "}
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {order?.products.map((product) => (
              
              <tr key={product?._id} className="border-b">
                <td className="py-2 px-4">{product.productId.name}</td>
                <td className="py-2 px-4">
                ৳ {Math.round(product.productId.price)}
                </td>
                <td className="py-2 px-4">{product?.quantity}</td>
                <td className="py-2 px-4">
                ৳ {Math.round(product.productId.price * product?.quantity)}{}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetails;
