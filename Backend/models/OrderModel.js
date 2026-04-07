import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    shippingAddress: {

      name: {
        type: String,
        trim: true
      },
      email: {
        type: String,
        trim: true
      },
      contact: {
        type: String,
        trim: true
      },
      address: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      pincode: {
        type: String,
        trim: true
      },

    },

    shipping: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMode: {
      type: String,
      enum: ["Online"],
      default: "Online"
    },

    razorpayOrderId: {
      type: String,
    },

    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    order_status: {
      type: String,
      enum: ["Processing", "Out For Delivery", "Delivered", "Cancelled"],
      default: "Processing"
    }

  },
  {
    timestamps: { createdAt: true, updatedAt: false } // only createdAt
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
