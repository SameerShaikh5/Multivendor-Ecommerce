import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getVendorOrderDetails,
  markOrderShipped,
} from "../../api/VendorApi.jsx";
import toast from "react-hot-toast"

const VendorOrderDetails = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Processing");
  const [isModalOpen, setIsModalOpen] = useState(false);


  // ===== FETCH ORDER =====
  const fetchOrderDetails = async () => {
    try {
      const data = await getVendorOrderDetails(orderId);
      setOrder(data);
      setStatus(data.order_status);
    } catch (err) {
      console.error("Failed to fetch order details", err);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);



  // ===== CONFIRM + SHIP =====
  const handleShip = () => {
    setIsModalOpen(true);
  };

  const confirmShipOrder = async () => {
    try {
      await markOrderShipped(orderId);
      setIsModalOpen(false);
      toast.success("Order marked as shipped to facility center")
      fetchOrderDetails();
    } catch (err) {
      console.error("Failed to ship order", err);
    }
  };

  // ===== STATUS STYLE =====
  const getStatusStyle = () => {
    switch (status) {
      case "Processing":
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped to Center":
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!order) return null;

  return (
    <div className="max-w-3xl space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-extrabold">Order Details</h1>

        <Link
          to="/vendor/orders"
          className="text-sm text-gray-600 hover:underline"
        >
          Back
        </Link>
      </div>

      {/* Order Info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Order Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p><strong>Order ID:</strong> #{order._id}</p>

          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

          <p>
            <strong>Status:</strong>
            <span
              className={`ml-2 inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle()}`}
            >
              {status}
            </span>
          </p>

          <p><strong>Payment:</strong> {order.payment_status}</p>
          <p><strong>Payout Status:</strong> {order.payout_status}</p>
        </div>

        {(status === "Processing" || status === "Pending") && (
          <button
            onClick={handleShip}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold mt-4 hover:bg-indigo-700 transition"
          >
            Mark as Shipped to Center
          </button>
        )}
      </div>

      {/* Product */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Product</h2>

        <div className="flex gap-4">
          <img src={order.product_id?.images[0]?.secure_url} className="w-24 h-24 bg-gray-100 rounded-xl" />

          <div>
            <h3 className="font-semibold">
              {order.product_id?.name}
            </h3>
            <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
            <p className="text-sm font-semibold text-indigo-600">
              ₹{order.totalAmount?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Customer Details</h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          {order.order_id?.shippingAddress?.name} <br />
          {order.order_id?.shippingAddress?.address} <br />
          {order.order_id?.shippingAddress?.city},{" "}
          {order.order_id?.shippingAddress?.state} –{" "}
          {order.order_id?.shippingAddress?.pincode} <br />
          Phone: {order.order_id?.shippingAddress?.contact}
        </p>
      </div>


      {/* ===== SHIP CONFIRM MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              Confirm Shipment
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to mark this order as shipped to facility center?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmShipOrder}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default VendorOrderDetails;