import razorpay from "../config/razorpay.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import Cart from "../models/CartModel.js";
import OrderItem from "../models/OrderItem.js";
import Order from "../models/OrderModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import crypto from "crypto";
import Payment from "../models/PaymentModel.js";


/* =========================================================
   CREATE ORDER
========================================================= */

export const createOrder = TryCatch(async (req, res, next) => {
  const { shippingAddress } = req.body;


  if(!shippingAddress){
    throw new ErrorHandler(400, "Shipping Address is required")
  }

  // 1️⃣ Get cart
  const cart = await Cart.findOne({ user_id: req.user._id })?.populate("items.product_id");

  if (!cart || cart.items.length === 0) {
    throw new ErrorHandler(404, "Cart is empty");
  }

  // 2️⃣ Calculate total
  let totalAmount = 0;

  cart.items.forEach(item => {
    totalAmount += item.product_id.price * item.quantity;
  });

  const shippingCharge = Number(process.env.SHIPPING || 0);
  totalAmount += shippingCharge;

  // 3️⃣ Create Order
  const order = await Order.create({
    user_id: req.user._id,
    shippingAddress,
    shipping: shippingCharge,
    totalAmount,
    payment_status: "Pending" // ✅ fixed
  });

  // 4️⃣ Commission %
  const COMMISSION_PERCENTAGE = Number(
    process.env.COMMISSION_PERCENTAGE || 10
  );

  // 5️⃣ Create Order Items
  const orderItemsData = cart.items.map(item => {
    const itemTotal = item.product_id.price * item.quantity;
    const commission = (itemTotal * COMMISSION_PERCENTAGE) / 100;

    return {
      order_id: order._id,
      user_id: req.user._id,
      product_id: item.product_id,
      vendor_id: item.vendor_id,
      quantity: item.quantity,
      price: item.product_id.price,
      totalAmount: itemTotal,
      commissionAmount: commission,
      vendorEarning: itemTotal - commission
    };
  });

  await OrderItem.insertMany(orderItemsData);

  // 6️⃣ Create Razorpay Order
  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: order._id.toString()
  });

  // 7️⃣ Save Razorpay order ID
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    razorpayOrder,
    key:razorpay.key_id,
    shipping:process.env.SHIPPING
  });
});


/* =========================================================
   VERIFY PAYMENT (TESTING MODE)
   Only requires razorpay_order_id for now
========================================================= */

export const verifyPayment = TryCatch(async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ErrorHandler(400, "Missing payment details");
  }

  /* ===============================
     1️⃣ Find Order
  =============================== */
  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!order) {
    throw new ErrorHandler(404, "Order not found");
  }

  /* ===============================
     2️⃣ Idempotency Check
  =============================== */
  if (order.payment_status === "Paid") {
    return res.status(200).json({
      success: true,
      message: "Payment already verified",
    });
  }

  /* ===============================
     3️⃣ Verify Razorpay Signature
  =============================== */
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ErrorHandler(400, "Invalid payment signature");
  }

  /* ===============================
     4️⃣ Mark Order Paid
  =============================== */
  order.payment_status = "Paid";
  order.razorpayPaymentId = razorpay_payment_id;
  await order.save();

  /* ===============================
     5️⃣ Update OrderItems
  =============================== */
  await OrderItem.updateMany(
    { order_id: order._id },
    { $set: { payment_status: "Paid" } }
  );

  /* ===============================
     6️⃣ Store Payment Record
  =============================== */
  await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      user_id: order.user_id,
      order_id: order._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: order.totalAmount,
    },
    { new: true, upsert: true }
  );

  /* ===============================
     7️⃣ Clear Cart
  =============================== */
  await Cart.deleteOne({ user_id: order.user_id });

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
  });
});


export const getUserOrders = TryCatch(async (req, res, next) => {

  const orders = await Order.find({
    user_id: req.user._id,
    payment_status: "Paid",
  })
    .sort({ createdAt: -1 }) // latest orders first
    .lean();

  if (!orders.length) {
    return res.status(200).json({
      success: true,
      message: "No orders found",
      data: { orders: [] },
    });
  }

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: { orders },
  });
});


export const getUserOrderDetails = TryCatch(async (req, res, next) => {
  const { orderId } = req.params;

  /* ===============================
     1️⃣ Find order (secure)
  =============================== */
  const order = await Order.findOne({
    _id: orderId,
    user_id: req.user._id,
  });

  if (!order) {
    throw new ErrorHandler(404, "Order not found");
  }

  /* ===============================
     2️⃣ Get order items
  =============================== */
  const orderItems = await OrderItem.find({
    order_id: orderId,
    user_id: req.user._id,
  }).populate("product_id"); // optional if relation exists

  res.status(200).json({
    success: true,
    message: "Order details fetched successfully",
    data: {
      order,
      orderItems,
    },
  });
});