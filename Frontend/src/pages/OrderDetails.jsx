import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderDetails } from "../api/orderApi";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = async () => {
    try {
      const res = await getOrderDetails(orderId);

      if (!res?.success) return;

      const backendOrder = res.data.order;
      const orderItems = res.data.orderItems;


      /* ================= MAP BACKEND → UI ================= */
      const formattedOrder = {
        id: backendOrder._id,
        status: backendOrder.order_status,
        statusColor:
          backendOrder.order_status === "Delivered"
            ? "green"
            : "yellow",

        items: orderItems.map((item) => ({
          id: item._id,
          name: item.product_id?.name || "Product",
          image: item.product_id?.images[0].secure_url,
          description: item.product_id?.description || "",
          quantity: item.quantity,
          price: `₹${Number(item.totalAmount).toLocaleString()}`,
          itemStatus: item.order_status,
        })),

        address: {
          name: backendOrder.shippingAddress.name,
          line1: backendOrder.shippingAddress.address,
          city: backendOrder.shippingAddress.city,
          state: backendOrder.shippingAddress.state,
          phone: backendOrder.shippingAddress.contact,
        },

        summary: {
          subtotal: `₹${(
            backendOrder.totalAmount - backendOrder.shipping
          ).toLocaleString()}`,
          shipping: `₹${backendOrder.shipping}`,
          payment: backendOrder.paymentMode,
          total: `₹${backendOrder.totalAmount.toLocaleString()}`,
        },
      };

      setOrder(formattedOrder);

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!order) return <p className="text-center py-20">Order not found</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Order Details</h1>
          <p className="text-sm text-gray-600">
            Order ID: <span className="font-semibold">#{order.id}</span>
          </p>
        </div>

        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            order.statusColor === "green"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <section className="lg:col-span-2 space-y-8">

          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-semibold mb-6">Items in this Order</h2>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-100 rounded-xl p-4 mb-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">

                  <img src={item.image} className="w-24 h-24 bg-gray-100 rounded-xl" />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Quantity: {item.quantity}
                    </p>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      {item.itemStatus}
                    </span>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <span className="font-semibold text-indigo-600">
                      {item.price}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.address.name}<br />
              {order.address.line1}<br />
              {order.address.city}<br />
              {order.address.state}<br />
              Phone: {order.address.phone}
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="bg-white border border-gray-100 rounded-2xl p-6 h-fit lg:sticky lg:top-24">

          <h3 className="font-semibold mb-6">Payment Summary</h3>

          <div className="space-y-4 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{order.summary.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.summary.shipping}</span>
            </div>

            <div className="flex justify-between">
              <span>Payment Method</span>
              <span>{order.summary.payment}</span>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{order.summary.total}</span>
            </div>
          </div>

          <Link
            to="/my-orders"
            className="block text-center bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600"
          >
            Back to Orders
          </Link>

        </aside>
      </div>
    </main>
  );
};

export default OrderDetails;