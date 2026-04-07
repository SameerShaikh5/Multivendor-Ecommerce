// pages/Admin/AdminOrders.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders } from "../../api/AdminApi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const data = await getAdminOrders({
          page,
          limit: 10,
          status: statusFilter === "All" ? "" : statusFilter,
        });

        setOrders(data.orders);
        setTotalPages(data.totalPages);

      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, statusFilter]);

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
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-extrabold">
          Orders
        </h1>

        {/* Status Filter */}
        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm
  w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">

        {loading && (
          <div className="text-sm text-gray-500">
            Loading orders...
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-sm text-gray-500">
            No orders found.
          </div>
        )}

        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4"
          >
            {/* Top */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">
                  Order ID
                </p>
                <p className="font-semibold">
                  #{order._id.slice(-8)}
                </p>
              </div>

              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.order_status)}`}
              >
                {order.order_status}
              </span>
            </div>

            {/* Order Info */}
            <div className="flex flex-col sm:flex-row gap-4">

              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  Customer: {order.user_id?.name}
                </p>

                <p className="text-sm text-gray-500">
                  Email: {order.user_id?.email}
                </p>

                <p className="text-sm font-semibold text-indigo-600">
                  ₹{order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">

              <span>
                Ordered on{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </span>

              <Link
                to={`/admin/orders/${order._id}`}
                className="text-indigo-600 font-semibold hover:underline"
              >
                View Details
              </Link>

            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">

          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm flex items-center">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}
    </>
  );
};

export default AdminOrders;