import User from "../models/UserModel.js";
import mongoose from "mongoose";
import VendorProfile from "../models/VendorProfile.js";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import OrderItem from "../models/OrderItem.js";
import Payout from "../models/Payout.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import razorpay from "../config/razorpay.js";
import axios from "axios";
import {
  createRazorpayContact,
  createFundAccount, createRazorpayPayout
} from "../services/razorpayPayoutService.js";






export const getAdminDashboardStats = TryCatch(
  async (req, res, next) => {

    // Run queries in parallel for speed
    const [
      totalUsers,
      totalVendors,
      pendingVendors,
      activeVendors,
      totalOrders,
      paidOrders,
      totalProducts,
      activeProducts,
      revenueResult
    ] = await Promise.all([

      // users
      User.countDocuments({ role: "User" }),

      // vendors
      User.countDocuments({ role: "Vendor" }),

      // vendor status
      VendorProfile.countDocuments({ status: "Pending" }),
      VendorProfile.countDocuments({ status: "Active" }),

      // orders
      Order.countDocuments(),
      Order.countDocuments({ payment_status: "Paid" }),

      // products
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),

      // total revenue from paid orders
      Order.aggregate([
        { $match: { payment_status: "Paid" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" }
          }
        }
      ])
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        pendingVendors,
        activeVendors,
        totalOrders,
        paidOrders,
        totalRevenue,
        totalProducts,
        activeProducts
      }
    });
  }
);



export const getAllVendors = TryCatch(async (req, res, next) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { status } = req.query;

  // filter object
  const filter = {};
  if (status) filter.status = status;

  // fetch vendors (only required fields)
  const vendors = await VendorProfile.find(filter)
    .select("_id businessName businessAddress category status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalVendors = await VendorProfile.countDocuments(filter);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(totalVendors / limit),
    totalVendors,
    vendors
  });
});



export const searchVendors = TryCatch(async (req, res, next) => {

  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query required"
    });
  }

  const vendors = await VendorProfile.find({
    $or: [
      { businessName: { $regex: query, $options: "i" } }
    ]
  })
    .select("_id businessName businessAddress category status")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    results: vendors.length,
    vendors
  });
});




export const getVendorDetails = TryCatch(async (req, res, next) => {

  const { vendorId } = req.params;

  // validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return next(new ErrorHandler(400, "Invalid vendor id"));
  }

  const vendor = await VendorProfile.aggregate([

    {
      $match: {
        _id: new mongoose.Types.ObjectId(vendorId)
      }
    },

    // join user data
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user"
      }
    },

    { $unwind: "$user" },

    {
      $project: {
        _id: 1,
        businessName: 1,
        businessAddress: 1,
        category: 1,
        status: 1,
        rejectionReason: 1,

        // banking
        bankAccountNumber: 1,
        ifscCode: 1,

        // razorpay
        razorpayContactId: 1,
        razorpayFundAccountId: 1,

        // user info
        user: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          role: "$user.role"
        },

        createdAt: 1
      }
    }
  ]);

  if (!vendor.length) {
    return next(new ErrorHandler(404, "Vendor not found"));
  }

  res.status(200).json({
    success: true,
    vendor: vendor[0]
  });
});




export const approveVendor = TryCatch(async (req, res, next) => {

  const { vendorId } = req.params;

  const vendor = await VendorProfile.findById(vendorId);

  if (!vendor) {
    return next(new ErrorHandler(404, "Vendor not found"));
  }

  if (vendor.status !== "Pending") {
    return next(new ErrorHandler(400, "Only pending vendors can be approved"));
  }



  // create contact
  const contact = await createRazorpayContact(vendor);

  // create fund account
  const fundAccount = await createFundAccount(contact.id, vendor);

  vendor.razorpayContactId = contact.id;
  vendor.razorpayFundAccountId = fundAccount.id;

  // ✅ 3. Save IDs in vendor profile
  vendor.razorpayContactId = contact.id;
  vendor.razorpayFundAccountId = fundAccount.id;

  // activate vendor
  vendor.status = "Active";
  vendor.rejectionReason = undefined;

  await vendor.save();

  res.status(200).json({
    success: true,
    message: "Vendor approved successfully"
  });

});



export const rejectVendor = TryCatch(async (req, res, next) => {

  const { vendorId } = req.params;

  const vendor = await VendorProfile.findById(vendorId);

  if (!vendor) {
    return next(new ErrorHandler(404, "Vendor not found"));
  }

  if (vendor.status !== "Pending") {
    return next(new ErrorHandler(400, "Only pending vendors can be rejected"));
  }

  vendor.status = "Rejected";
  // vendor.rejectionReason = reason;

  await vendor.save();

  res.status(200).json({
    success: true,
    message: "Vendor rejected successfully"
  });
});





export const getOrders = TryCatch(async (req, res) => {

  const {
    order_status,
    payment_status,
    startDate,
    endDate,
    page = 1,
    limit = 10
  } = req.query;

  const skip = (page - 1) * limit;

  // ==========================
  // build filter dynamically
  // ==========================

  const filter = {};

  if (order_status) filter.order_status = order_status;
  if (payment_status) {
    filter.payment_status = payment_status
  } else {
    filter.payment_status = "Paid"
  }

  // date range filter
  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  // ==========================
  // fetch orders
  // ==========================

  const orders = await Order.find(filter)
    .populate("user_id", "name email")
    .select(
      "_id user_id totalAmount payment_status order_status createdAt"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const totalOrders = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    page: Number(page),
    totalPages: Math.ceil(totalOrders / limit),
    totalOrders,
    orders
  });
});





export const getOrderDetails = TryCatch(async (req, res, next) => {

  const { orderId } = req.params;

  // get order
  const order = await Order.findById(orderId)
    .populate("user_id", "name email")
    .lean();

  if (!order) {
    return next(new ErrorHandler(404, "Order not found"));
  }

  // get all items inside order
  const orderItems = await OrderItem.find({ order_id: orderId })
    .populate("product_id", "name price images")
    .populate("vendor_id", "businessName")
    .lean();

  res.status(200).json({
    success: true,
    order,
    orderItems
  });
});






// update order status
export const updateOrderStatus = TryCatch(async (req, res, next) => {

  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ErrorHandler(404, "Order not found");
  }

  // prevent changes after delivery
  if (order.order_status === "Delivered") {
    throw new ErrorHandler(400, "Order already delivered");
  }

  // ==============================
  // CASE 1 → Processing → Out For Delivery
  // ==============================

  if (order.order_status === "Processing") {

    const orderItems = await OrderItem.find({ order_id: order._id });

    if (!orderItems.length) {
      throw new ErrorHandler(400, "No order items found");
    }

    // check all items shipped to facility
    const allShipped = orderItems.every(
      item => item.order_status === "Shipped to Facility Center"
    );

    if (!allShipped) {
      throw new ErrorHandler(
        400,
        "All order items must be 'Shipped to Facility Center'"
      );
    }

    // update order
    order.order_status = "Out For Delivery";
    await order.save();

    // update all items
    await OrderItem.updateMany(
      { order_id: order._id },
      { order_status: "Out For Delivery" }
    );

    return res.status(200).json({
      success: true,
      message: "Order moved to Out For Delivery",
      data: order
    });
  }

  // ==============================
  // CASE 2 → Out For Delivery → Delivered
  // ==============================

  if (order.order_status === "Out For Delivery") {

    order.order_status = "Delivered";
    await order.save();

    await OrderItem.updateMany(
      { order_id: order._id },
      {
        order_status: "Delivered",
        deliveredAt: new Date()
      }
    );

    return res.status(200).json({
      success: true,
      message: "Order delivered successfully",
      data: order
    });
  }

  throw new ErrorHandler(400, "Order cannot be updated further");
});





export const getEligiblePayoutOrders = TryCatch(async (req, res, next) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await OrderItem.find({
    order_status: "Delivered",
    payment_status: "Paid",
    // payout_status: "Pending"
  })
    .populate("vendor_id", "businessName")
    .populate("product_id", "name ")
    .select(
      "_id vendor_id product_id order_id quantity price totalAmount vendorEarning payout_status deliveredAt"
    )
    .sort({ deliveredAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await OrderItem.countDocuments({
    order_status: "Delivered",
    payment_status: "Paid",
    payout_status: "Pending"
  });

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    orders
  });
});








export const payVendor = TryCatch(async (req, res, next) => {

  const { orderItemId } = req.params;
  const method = "IMPS";

  // find order item
  const orderItem = await OrderItem.findById(orderItemId);

  if (!orderItem)
    return next(new ErrorHandler(404, "Order item not found"));

  // eligibility checks
  if (orderItem.order_status !== "Delivered")
    return next(new ErrorHandler(400, "Order not delivered"));

  if (orderItem.payment_status !== "Paid")
    return next(new ErrorHandler(400, "Customer payment not completed"));

  if (orderItem.payout_status === "Paid")
    return next(new ErrorHandler(400, "Vendor already paid"));

  // get vendor
  const vendor = await VendorProfile.findById(orderItem.vendor_id);

  if (!vendor || vendor.status !== "Active")
    return next(new ErrorHandler(400, "Vendor not active"));

  if (!vendor.razorpayFundAccountId)
    return next(new ErrorHandler(400, "Vendor payout account not configured"));

  // prevent duplicate payout
  const existingPayout = await Payout.findOne({
    order_item_id: orderItem._id,
    status: "Paid"
  });

  if (existingPayout)
    return next(new ErrorHandler(400, "Payout already processed"));

  // create payout record (rupees)
  const payout = await Payout.create({
    vendor_id: vendor._id,
    order_item_id: orderItem._id,
    amount: orderItem.vendorEarning,
    method,
    status: "Pending"
  });

  try {

    // rupees → paise
    const razorpayAmount = Math.round(payout.amount * 100);

    let razorpayResponse;



    // ================= TEST MODE =================
    if (process.env.NODE_ENV === "development") {

      razorpayResponse = {
        id: "payout_test_" + Date.now()
      };

    } else {

      razorpayResponse = await createRazorpayPayout({
        fundAccountId: vendor.razorpayFundAccountId,
        amount: razorpayAmount,
        method
      });
    }

    // update payout
    payout.status = "Paid";
    payout.razorpayPayoutId = razorpayResponse.id;
    await payout.save();

    // update order item
    orderItem.payout_status = "Paid";
    await orderItem.save();

    res.status(200).json({
      success: true,
      message: "Vendor paid successfully",
      payout
    });

  } catch (error) {

    console.log("PAYOUT ERROR:", error.response?.data || error.message);

    payout.status = "Failed";
    await payout.save();

    return next(new ErrorHandler(500, "Payout failed"));
  }
});







export const suspendVendor = TryCatch(async (req, res, next) => {

  const { vendorId } = req.params;

  const vendor = await VendorProfile.findById(vendorId);

  if (!vendor) {
    return next(new ErrorHandler(404, "Vendor not found"));
  }

  if (vendor.status !== "Active") {
    return next(new ErrorHandler(400, "Only active vendors can be suspended"));
  }

  vendor.status = "Suspended";

  await vendor.save();

  res.status(200).json({
    success: true,
    message: "Vendor suspended successfully"
  });
});