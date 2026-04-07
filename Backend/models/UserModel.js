import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,     // ensures unique email
      index: true,      // creates index for faster search
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use valid email"]
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    contact: {
      type: String,
      required: true,
      minlength: 10
    },

    role: {
      type: String,
      enum: ["User", "Vendor", "Admin"],
      default: "User"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // auto creates createdAt & updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User