// pages/Admin/AdminOrderDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../../api/AdminApi";
import toast from "react-hot-toast";

const AdminOrderDetails = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // fetch order
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const data = await getAdminOrderById(orderId);
        setOrder(data.order);
        setOrderItems(data.orderItems);
        console.log("data", data)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // update order status
  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);

      const promise = updateAdminOrderStatus(orderId);

      toast.promise(promise, {
        loading: "Updating order...",
        success: "Order status updated",
        error: "Failed to update order",
      });

      const res = await promise;

      setOrder(res.data);
      setShowModal(false);

    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Out For Delivery":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold">
          Order Details
        </h1>

        <Link
          to="/admin/orders"
          className="text-sm text-gray-600 hover:underline"
        >
          Back
        </Link>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Order Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-semibold">Order Summary</h2>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.order_status)}`}
            >
              {order.order_status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
            <p><strong>Order ID:</strong> #{order._id.slice(-8)}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment:</strong> {order.paymentMode}</p>
            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          </div>

          {/* Update Status Button */}
          {order.order_status !== "Delivered" && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 text-sm font-semibold
              border border-indigo-200 text-indigo-700
              rounded-lg hover:bg-indigo-50 transition"
            >
              Update Order Status
            </button>
          )}
        </div>

        {/* Customer Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">
            Customer Details
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            {order.shippingAddress?.name} <br />
            {order.shippingAddress?.address} <br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} <br />
            Phone: {order.shippingAddress?.contact}
          </p>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          {orderItems.map(item => (
            <div
              key={item._id}
              className="bg-white border border-gray-100 rounded-2xl p-6"
            >
              <div className="flex gap-5">

                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={
                      
                      item.product_id?.images?.[0]?.secure_url ||
                      "https://placehold.co/100x100"
                    }
                    alt={item.product_id?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Content */}
                <div className="flex-1">

                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">
                      {item.product_id?.name}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.order_status)}`}
                    >
                      {item.order_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <p><strong>Price:</strong> ₹{item.price}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Vendor Earning:</strong> ₹{item.vendorEarning}</p>
                    <p><strong>Commission:</strong> ₹{item.commissionAmount}</p>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 space-y-4">
            <h3 className="font-semibold text-lg">
              Update Order Status?
            </h3>

            <p className="text-sm text-gray-500">
              This will move the order to the next stage.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={updating}
                onClick={handleUpdateStatus}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrderDetails;