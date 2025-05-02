import { Link, useParams } from "react-router-dom";
import { useGetOrdersByIdQuery } from "../../../../redux/features/orders/orderApi";
import Loading from "../../../../components/Loading";
import TimelineStep from "../../../../components/TimelineStep";

const steps = [
  {
    status: "pending",
    label: "Pending",
    description: "Your order has been created and is awaiting processing.",
    icon: {
      iconName: "edit-2-line",
      bgColor: "red-500",
      textColor: "gray-800",
    },
  },
  {
    status: "processing",
    label: "Processing",
    description: "Your order is currently being processed.",
    icon: {
      iconName: "loader-line",
      bgColor: "yellow-500",
      textColor: "yellow-800",
    },
  },
  {
    status: "shipped",
    label: "Shipped",
    description: "Your order has been shipped.",
    icon: {
      iconName: "truck-line",
      bgColor: "blue-800",
      textColor: "blue-100",
    },
  },
  {
    status: "completed",
    label: "Completed",
    description: "Your order has been successfully completed.",
    icon: { iconName: "check-line", bgColor: "green-800", textColor: "white" },
  },
];

const OrderDetail = () => {
  const { orderId } = useParams();

  const { data, isLoading, error } = useGetOrdersByIdQuery(orderId);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading order details</div>;

  const order = data?.data || {};

  console.log(`order ${order}`)

  const isCompleted = (status) => {
    const statuses = ["pending", "processing", "shipped", "completed"];
    return statuses.indexOf(status) < statuses.indexOf(order.status);
  };
  const isCurrent = (status) => order.status === status;

  return (
    <div className="section__container rounded p-6">
      
     <h2 className="text-2xl font-semibold mb-4">Payment {order?.status}</h2>
      <p className="mb-4">Order Id: {order?.orderId.slice(0,6)}</p>
      <p className="mb-8">Status: {order?.status}</p>
     <p className="mb-8">EarnCoin: {order?.coinsEarned}</p>
-
      <ol className="sm:flex items-center relative">
        {steps.map((step, index) => (
          <TimelineStep
            key={index}
            step={step}
            order={order}
            isCompleted={isCompleted(step.status)}
            isCurrent={isCurrent(step.status)}
            isLastStep={index === steps.length - 1}
            icon={step.icon}
            description={step.description}
          />
        ))}
      </ol>



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
                <td className="py-2 px-4"><Link to={`/shop/${product.productId._id}`}>{product.productId.name}</Link></td>
                <td className="py-2 px-4">
                ৳ {Math.round(product.productId.price)}
                </td>
                <td className="py-2 px-4">{product?.quantity}</td>
                <td className="py-2 px-4">
                ৳  {Math.round(product.productId.price * product?.quantity)}{}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default OrderDetail;
