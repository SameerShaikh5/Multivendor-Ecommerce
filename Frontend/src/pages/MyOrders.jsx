import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";
import OrderListCard from "../components/OrderListCard";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();

      if (res?.success) {
        // transform backend → UI format
        const formattedOrders = res.data.orders.map((order) => ({
          id: order._id,
          status: order.order_status,
          statusColor: getStatusColor(order.order_status),
          date: new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          amount: `₹${Number(order.totalAmount).toLocaleString()}`,
          payment: order.paymentMode,
        }));

        setOrders(formattedOrders);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= STATUS COLOR HELPER ================= */
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "green";
      case "Processing":
        return "yellow";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) return <p className="text-center py-20">Loading orders...</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          orders.map((order) => (
            <OrderListCard key={order.id} order={order} />
          ))
        )}
      </div>
    </main>
  );
};

export default MyOrders;