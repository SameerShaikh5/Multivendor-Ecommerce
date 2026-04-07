import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        // User who made payment
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Order associated with payment
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true
        },

        // Razorpay Order ID (created from backend)
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        // Razorpay Payment ID (after success)
        razorpayPaymentId: {
            type: String,
            default: null,
            index: true
        },

        // Razorpay Signature for verification
        razorpaySignature: {
            type: String,
            default: null
        },

        
        amount: {
            type: Number,
            required: true,
            min: 0
        },

        currency: {
            type: String,
            default: "INR"
        },
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
