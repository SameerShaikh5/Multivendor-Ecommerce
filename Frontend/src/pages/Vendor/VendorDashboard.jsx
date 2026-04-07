import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVendorStats, getVendorOrders } from "../../api/VendorApi.jsx";

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
  });
  

  const [orders, setOrders] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const statsData = await getVendorStats();
      setStats(statsData);

      const ordersData = await getVendorOrders();

      // show only 2 recent orders
      setOrders(ordersData.slice(0, 2));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

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

  useEffect(() => {
    fetchDashboardData();
  }, []);


  return (
    <div className="bg-gray-50 min-h-screen flex text-gray-900">
      <main className="flex-1 px-6 py-8">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <p className="text-3xl font-extrabold">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-1">Revenue</p>
            <p className="text-3xl font-extrabold text-indigo-600">
              ₹{stats.totalRevenue?.toLocaleString()}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-1">Active Products</p>
            <p className="text-3xl font-extrabold">
              {stats.activeProducts}
            </p>
          </div>

        </div>

        {/* ================= RECENT ORDERS ================= */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-semibold mb-6">Recent Orders</h2>

          <div className="space-y-4">

            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold">
                    #{order.order_id?._id?.slice(-6)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-semibold">
                    {order.product_id?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold  ${getStatusStyle(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-indigo-600">
                    ₹{order.totalAmount?.toLocaleString()}
                  </p>
                </div>

                <Link
                  to={`/vendor/orders/${order._id}`}
                  className="text-sm font-semibold text-indigo-600 hover:underline"
                >
                  View
                </Link>
              </div>
            ))}

          </div>
        </div>

      </main>
    </div>
  );
};

export default VendorDashboard;