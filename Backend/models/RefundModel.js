import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },

    order_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
      // reference OrderItem if you create separate order items collection
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true
    },

    amount: {
      type: Number, // in paise
      required: true,
      min: 0
    },

    reason: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["PENDING", "PROCESSED", "FAILED"],
      default: "PENDING"
    },

    razorpayRefundId: {
      type: String,
      default: null
    },

    initiatedBy: {
      type: String,
      enum: ["USER", "ADMIN", "SYSTEM"],
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
