import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    // Parent order
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },

    // Customer
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // Product purchased
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    // Vendor who sold the product
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
      index: true
    },

    // Quantity ordered
    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    // Price snapshot at purchase time (VERY IMPORTANT)
    price: {
      type: Number,
      required: true,
      min: 0
    },

    // Total for this item (price * quantity)
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    // Commission marketplace takes
    commissionAmount: {
      type: Number,
      default: 0
    },

    // Vendor earning after commission
    vendorEarning: {
      type: Number,
      default: 0
    },

    // Item lifecycle
    order_status: {
      type: String,
      enum: [
        "Pending",
        "Shipped to Facility Center",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
        "Returned",
        "Refunded"
      ],
      default: "Pending",
      index: true
    },

    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
      index: true
    },

    payout_status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",

    },


    shippedAt: Date,
    deliveredAt: Date
  },
  {
    timestamps: true
  }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
