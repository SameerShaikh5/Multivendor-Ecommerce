import cloudinary from "../config/cloudinary.js";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import Product from "../models/ProductModel.js";
import VendorProfile from "../models/VendorProfile.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import ErrorHandler from "../utils/ErrorHandler.js";


export const getProductById = TryCatch(async (req, res, next) => {


  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ErrorHandler(404, "Product not found")
  }


  return res.status(201).json({
    success: true,
    message: "Product fetched successfully!",
    data: product
  });
});


export const createProduct = TryCatch(async (req, res, next) => {

  const { name, description, price, category } = req.body;
  const images = req.files

  // basic validation (replace with zod later)
  if (!name || !price || !category) {
    throw new ErrorHandler(400, "Please provide all required fields")
  }

  // get vendor from logged-in user (after protect middleware)
  const vendor = await VendorProfile.findOne({user_id:req.user._id})

  if(!vendor) throw new ErrorHandler(404, "Vendor not found")


  // check images exist
  if (!images || images.length === 0) {
    throw new ErrorHandler(400, "Please upload at least one image");
  }


  // upload images
  const uploadPromises = images.map(file =>
    uploadToCloudinary(file.buffer, "products")
  );

  const results = await Promise.all(uploadPromises);

  // store only public_id and secure_url
  const imageObjects = results.map(item => ({
    public_id: item.public_id,
    secure_url: item.secure_url
  }));


  const product = await Product.create({
    vendor_id: vendor._id,
    name,
    description,
    images: imageObjects,
    price,
    category
  });

  return res.status(201).json({
    success: true,
    message: "Product created successfully!",
    data: product
  });
});





export const updateProduct = TryCatch(async (req, res, next) => {
  const { productId } = req.params;
  const newImages = req.files;
  let { removedImages } = req.body;

  const { name, description, price, category } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ErrorHandler(404, "Product not found!");
  }

  const vendor = await VendorProfile.findOne({user_id:req.user._id})

  if(!vendor){
    throw new ErrorHandler(400, "Vendor not found")
  }

  // ⭐ vendor ownership check
  if (product.vendor_id.toString() !== vendor._id.toString()) {
    throw new ErrorHandler(403, "You are not allowed to update this product");
  }

  /* ---------- update fields ---------- */

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = price; // safer check
  if (category) product.category = category;

  /* ---------- parse removed images ---------- */

  if (removedImages) {
    if (typeof removedImages === "string") {
      try {
        removedImages = JSON.parse(removedImages);
      } catch {
        removedImages = [removedImages];
      }
    }
  }

  /* ---------- delete removed images ---------- */

  if (removedImages && removedImages.length > 0) {
    await Promise.all(
      removedImages.map(id => cloudinary.uploader.destroy(id))
    );

    product.images = product.images.filter(
      img => !removedImages.includes(img.public_id)
    );
  }

  /* ---------- upload new images ---------- */

  if (newImages && newImages.length > 0) {
    const uploadPromises = newImages.map(file =>
      uploadToCloudinary(file.buffer, "products")
    );

    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map(item => ({
      public_id: item.public_id,
      secure_url: item.secure_url
    }));

    product.images.push(...uploadedImages);
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});




export const deactivateProduct = TryCatch(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ErrorHandler(404, "Product not found");
  }

  if(!product.isActive){
    throw new ErrorHandler(400, "Product is already inactive.")
  }

  const vendor = await VendorProfile.findOne({user_id:req.user._id})

  if(!vendor){
    throw new ErrorHandler(404, "Product vendor not found")
  }

  // ⭐ vendor ownership check
  if (product.vendor_id.toString() !== vendor._id.toString()) {
    throw new ErrorHandler(403, "You are not allowed to deactivate this product");
  }

  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product deactivated successfully!"
  });
});



export const getAllProducts = TryCatch(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const search = req.query.search || "";
  const limit = 10;
  const skip = (page - 1) * limit;

  // search filter
  const filter = {
    isActive: true,
    name: { $regex: search, $options: "i" } // case-insensitive
  };

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(filter);

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully!",
    data: products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    }
  });
});


