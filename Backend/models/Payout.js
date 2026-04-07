import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
      index: true
    },

    order_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"OrderItem"

    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    method: {
      type: String,
      enum: ["IMPS", "NEFT"],
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    razorpayPayoutId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
