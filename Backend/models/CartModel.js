import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
      index: true
    },


    quantity: {
      type: Number,
      required: true,
      min: 1
    },

  },
  { _id: false } // prevents extra _id for each item (optional optimization)
);

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,   // one cart per user
      index: true
    },

    items: [cartItemSchema]
  },
  {
    timestamps: false // we only want updatedAt
  }
);

// only updatedAt field
cartSchema.set("timestamps", { createdAt: false, updatedAt: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart