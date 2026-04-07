import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        vendor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VendorProfile",   // reference to VendorProfile
            required: true,
            index: true             // faster vendor product queries
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        images: {
            type: [
                {
                    public_id: { type: String, required: true },
                    secure_url: { type: String, required: true },
                    isThumbnail: { type: Boolean, default: false } // optional future feature
                }
            ],
            validate: [arr => arr.length <= 3, "Maximum 3 images allowed"]
        },


        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {

            type: String,
            enum: ["Electronics", "Fashion", "Books", "Home", "Other"],
            required: true

        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // adds createdAt & updatedAt
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product
