import express from "express";
import { createProduct, deactivateProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js";
import upload from "../utils/multer.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { vendorApprovedMiddleware } from "../middlewares/vendorMiddleware.js";

const router = express.Router()

router.get("/", getAllProducts)


router.get("/:productId", getProductById)


router.post("/create",authMiddleware(["Vendor"]),vendorApprovedMiddleware,upload.array('images', 3), createProduct)

router.patch("/:productId",authMiddleware(["Vendor"]),vendorApprovedMiddleware, upload.array('images', 3), updateProduct)

router.patch("/deactivate/:productId",authMiddleware(["Vendor"]),vendorApprovedMiddleware, deactivateProduct)

export const productRoutes = router