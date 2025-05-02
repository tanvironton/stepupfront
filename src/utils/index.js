export function capitalizeString(str) {
  if (str.length === 0) return str; // Handle empty strings
  return str.trim().charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function priceDisplay(discount, salePrice, discountPrice) {
  let currentPrice = discountPrice;
  if (discount > 0 && !salePrice) {
    currentPrice = discountPrice;
  }
  if (discount === 0 && salePrice) {
    currentPrice = salePrice;
  }
  return currentPrice;
}

export function formatDate(isoDateString) {
  // Parse the ISO date string
  const date = new Date(isoDateString);
  // Get the day of the week, month, and year
  const options = {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  // Format the date
  return date.toLocaleDateString("en-US", options);
}

export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "processing":
      return "bg-blue-500";
    case "shipped":
      return "bg-green-500";
    case "completed":
      return "bg-gray-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
};

export const getPaymentStatusColor = (status) => {
  switch (status) {
    case true:
      return "bg-green-500";
    case !true:
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
};
