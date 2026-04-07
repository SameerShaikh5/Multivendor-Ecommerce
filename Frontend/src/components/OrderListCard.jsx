import React from "react";
import { Link } from "react-router-dom";

const OrderListCard = ({ order }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">

      {/* Top */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-semibold">#{order.id}</p>
        </div>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
          ${
            order.statusColor === "green"
              ? "bg-green-100 text-green-700"
              : order.statusColor === "yellow"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
        <div>
          <p className="text-gray-500">Order Date</p>
          <p className="font-medium">{order.date}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Amount</p>
          <p className="font-medium">{order.amount}</p>
        </div>
        <div>
          <p className="text-gray-500">Payment</p>
          <p className="font-medium">{order.payment}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Link
          to={`/orders/${order.id}`}
          className="text-sm font-semibold text-indigo-600 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default OrderListCard;