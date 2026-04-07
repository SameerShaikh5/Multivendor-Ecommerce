import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVendorOrders } from "../../api/VendorApi.jsx";

const VendorOrders = () => {
  
  const [filter, setFilter] = useState("All Orders");
  const [orders, setOrders] = useState([]);



  const fetchOrders = async () => {
    try {
      const data = await getVendorOrders();


      const formattedOrders = data.map((item) => ({
        id: item._id,
        status: item.order_status, // use backend status directly
        product: item.product_id?.name,
        image:item.product_id?.images[0].secure_url,
        qty: item.quantity,
        price: `₹${item.totalAmount?.toLocaleString()}`,
        date: new Date(item.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Failed to fetch vendor orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  // Filter logic
  const filteredOrders =
    filter === "All Orders"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Shipped":
      case "Shipped to Facility Center":
        return "bg-blue-100 text-blue-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold">Orders</h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option>All Orders</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped to Facility Center</option>
          <option>Delivered</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-4"
          >
            {/* Top */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">#{order.id}</p>
              </div>

              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* Product */}
            <div className="flex flex-col sm:flex-row gap-4">
              <img src={order.image} className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0" />

              <div className="flex-1">
                <h3 className="font-semibold">{order.product}</h3>
                <p className="text-sm text-gray-500">Qty: {order.qty}</p>
                <p className="text-sm text-gray-500">{order.price}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <div className="text-sm text-gray-600">
                Ordered on {order.date}
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/vendor/orders/${order.id}`}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-gray-500 text-sm">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;