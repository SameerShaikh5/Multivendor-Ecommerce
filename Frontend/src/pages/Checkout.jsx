import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ FIXED IMPORT
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../api/orderApi";
import { loadRazorpay } from "../utils/loadRazorpay";
import { useCart } from "../ContextApi/CartContext";
import { useAuth } from "../ContextApi/AuthContext";

const Checkout = () => {
  const { cartItems, shippingCost, setCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ================= VALIDATION ================= */
  const validateShipping = () => {
    const { name, email, contact, address, city, state, pincode } = shipping;

    if (!name || !email || !contact || !address || !city || !state || !pincode) {
      toast.error("Please fill all shipping details");
      return false;
    }

    // email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter valid email");
      return false;
    }

    // phone validation (10 digit Indian number)
    if (!/^[6-9]\d{9}$/.test(contact)) {
      toast.error("Enter valid 10 digit phone number");
      return false;
    }

    // pincode validation (6 digit)
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Enter valid 6 digit pincode");
      return false;
    }

    return true;
  };

  /* ================= STATE ================= */
  const [shipping, setShipping] = useState({
    name: "",
    email: user?.email || "",
    contact: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  /* ================= CART TOTAL ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingPrice = Number(shippingCost || 0);
  const total = subtotal + shippingPrice;

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    try {
      if (!validateShipping()) return;
      // 1️⃣ Create order from backend
      const orderData = await createOrder({
        shippingAddress: shipping, // ✅ FIXED
      });

      if (!orderData?.success) {
        toast.error("Order creation failed");
        return;
      }

      // 2️⃣ Load Razorpay SDK
      const rzpLoaded = await loadRazorpay();

      if (!rzpLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // 3️⃣ Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        order_id: orderData.razorpayOrder.id,

        // ⭐ auto-fill user info
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: shipping.contact,
        },

        handler: async function (response) {
          try {
            const res = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });


            toast.success("Payment successful");
            setCartItems([])
            navigate("/order-success");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        },

        // ⭐ payment cancel handler
        modal: {
          ondismiss: () => toast.error("Payment cancelled"),
        },
      };

      // 4️⃣ Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <section className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Contact Information</h2>

            <input
              type="email"
              name="email"
              value={shipping.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Shipping */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-semibold mb-6">Shipping Address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Full Name"
                value={shipping.name}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
                required={true}
              />

              <input
                name="contact"
                placeholder="Phone Number"
                value={shipping.contact}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
                required={true}

              />

              <input
                name="address"
                placeholder="Address Line 1"
                value={shipping.address}
                onChange={handleChange}
                className="sm:col-span-2 border border-gray-200 rounded-lg px-4 py-3 text-sm"
                required={true}

              />

              <input
                name="city"
                placeholder="City"
                value={shipping.city}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
                required={true}
              />

              <input
                name="state"
                placeholder="State"
                value={shipping.state}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
                required
              />

              <input
                name="pincode"
                placeholder="Pincode"
                value={shipping.pincode}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
                required={true}
              />
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="bg-white border border-gray-100 rounded-2xl p-6 h-fit lg:sticky lg:top-24">
          <h3 className="font-semibold mb-6">Order Summary</h3>

          <div className="space-y-4 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingPrice.toLocaleString()}</span>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-indigo-600 transition"
          >
            Place Order
          </button>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;