import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Success = () => {
  const { tran_id } = useParams();
  console.log(tran_id); // Logs the transaction ID to the console

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Success!</h1>
        <p className="text-lg text-gray-600 mb-6">Your payment was successful.</p>
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
          <strong>Transaction ID:</strong> <span>{tran_id}</span>
        </div>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
