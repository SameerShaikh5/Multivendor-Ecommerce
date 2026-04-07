import {  useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();


  

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-3xl p-10 max-w-md w-full text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your payment has been confirmed.
        </p>

        {/* Order Details */}
        {/* <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium">{orderId}</span>
          </div>

          {amount && (
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-medium">₹{amount.toLocaleString()}</span>
            </div>
          )}
        </div> */}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/shop")}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            className="w-full border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;