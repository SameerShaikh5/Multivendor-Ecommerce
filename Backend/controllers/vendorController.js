import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import VendorProfile from "../models/VendorProfile.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/ProductModel.js"



export const registerVendor = TryCatch(async (req, res, next) => {
  const {
    name,
    email,
    contact,
    password,
    businessName,
    businessAddress,
    bankAccountNumber,
    ifscCode
  } = req.body;

  // basic validation
  if (
    !name ||
    !email ||
    !password ||
    !businessName ||
    !bankAccountNumber ||
    !ifscCode
  ) {
    throw new ErrorHandler(400, "Please provide all required fields");
  }

  // IFSC validation (4 letters + 0 + 6 chars)
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
  if (ifscCode && !ifscRegex.test(ifscCode)) {
    throw new ErrorHandler(400, "Invalid IFSC format (Example: HDFC0001234)");
  }

  // check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ErrorHandler(400, "Email already exists!");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user with vendor role
  const newUser = await User.create({
    name,
    email,
    contact,
    password: hashedPassword,
    role: "Vendor"
  });

  // create vendor profile
  await VendorProfile.create({
    user_id: newUser._id,
    businessName,
    businessAddress,
    bankAccountNumber: bankAccountNumber.trim(),
    ifscCode: ifscCode.toUpperCase(),
    status: "Pending"
  });

  res.status(201).json({
    success: true,
    message: "Vendor registered successfully! Please wait for approval."
  });
});



export const getAllOrders = TryCatch(async (req, res, next) => {
  const vendorId = await VendorProfile.findOne({user_id:req.user._id})



  const orders = await OrderItem.find({
    vendor_id: vendorId,
    payment_status: "Paid"
  })
    .populate("product_id", "name price images")
    .populate("order_id", "shippingAddress createdAt");

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});



export const getOrderDetailsById = TryCatch(async (req, res, next) => {
  const { orderItemId } = req.params;


  const vendor = req.vendorProfile

  const orderItem = await OrderItem.findOne({
    _id: orderItemId,
    vendor_id: vendor._id
  })
    .populate("product_id", "name price images")
    .populate("order_id", "shippingAddress createdAt");

  if (!orderItem) {
    throw new ErrorHandler(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Order Details fetched!",
    data: orderItem
  });
});


export const markOrderShippedToFacility = TryCatch(async (req, res, next) => {
  const { orderItemId } = req.params;


  const vendor = req.vendorProfile

  const orderItem = await OrderItem.findOne({
    _id: orderItemId,
    vendor_id: vendor._id
  });

  if (!orderItem) {
    throw new ErrorHandler(404, "Order not found");
  }

  // ⭐ allow only if current status is Pending
  if (orderItem.order_status !== "Pending") {
    throw new ErrorHandler(
      400,
      "Order already processed. Cannot update further."
    );
  }

  // vendor can only move to this status
  orderItem.order_status = "Shipped to Facility Center";
  await orderItem.save();

  res.status(200).json({
    success: true,
    message: "Order marked as shipped to facility center",
    data: orderItem
  });
});




export const getVendorProfile = TryCatch(async (req, res, next) => {
  const vendorProfile = await VendorProfile.findOne({
    user_id: req.user._id
  }).select("-__v");

  if (!vendorProfile) {
    throw new ErrorHandler(404, "Vendor profile not found");
  }

  res.status(200).json({
    success: true,
    data: vendorProfile
  });
});


export const getVendorDashboardStats = TryCatch(async (req, res, next) => {
  const vendor = req.vendorProfile

  const vendorId = req.vendorProfile._id
  /* -------------------------------
     1️⃣ TOTAL PAID ORDERS
  --------------------------------*/

  const totalOrders = await OrderItem.countDocuments({
    vendor_id: vendorId,
    payment_status: "Paid"
  });

  /* -------------------------------
     2️⃣ TOTAL REVENUE (ONLY DELIVERED)
  --------------------------------*/

  const revenueData = await OrderItem.aggregate([
    {
      $match: {
        vendor_id: vendorId,
        payment_status: "Paid",
        order_status: "Delivered"
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$vendorEarning" }
      }
    }
  ]);

  /* -------------------------------
     3️⃣ ACTIVE PRODUCTS
  --------------------------------*/

  const activeProducts = await Product.countDocuments({
    vendor_id: vendorId,
    isActive: true
  });

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      activeProducts
    }
  });
});


export const getVendorProducts = TryCatch(async (req, res, next) => {

  // get vendor profile from logged-in user
  const vendor = await VendorProfile.findOne({ user_id: req.user._id });

  if (!vendor) {
    return next(new ErrorHandler(404, "Vendor not found"));
  }

  // pagination params
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  // total products count (for frontend pagination)
  const totalProducts = await Product.countDocuments({
    vendor_id: vendor._id
  });

  // fetch paginated products
  const products = await Product.find({
    vendor_id: vendor._id
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),
    products
  });

});