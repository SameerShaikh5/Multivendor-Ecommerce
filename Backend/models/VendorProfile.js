import mongoose from "mongoose";


const vendorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",        // reference to User model
      required: true,
      unique: true        // one vendor profile per user
    },

    businessName: {
      type: String,
      required: true,
      trim: true
    },

    bankAccountNumber: {
      type: String,
      required: true,
      trim:true
    },

    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    razorpayContactId: {
      type: String,
      default: null
    },

    razorpayFundAccountId: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["Pending", "Active", "Rejected", "Suspended"],
      default: "Pending"
    },

    rejectionReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);

const VendorProfile = mongoose.model("VendorProfile", vendorProfileSchema);

export default VendorProfile