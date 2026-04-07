import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  decreaseQuantity,
  getCart,
  increaseQuantity,
  removeFromCart
} from "../controllers/cartController.js";

const router = express.Router();

// get cart
router.get("/", authMiddleware(["User", "Vendor", "Admin"]), getCart);

// add item
router.post("/", authMiddleware(["User", "Vendor", "Admin"]), addToCart);

// remove item
router.delete("/:productId", authMiddleware(["User", "Vendor", "Admin"]), removeFromCart);

// increase quantity
router.patch("/increase/:productId", authMiddleware(["User", "Vendor", "Admin"]), increaseQuantity);

// decrease quantity
router.patch("/decrease/:productId", authMiddleware(["User", "Vendor", "Admin"]), decreaseQuantity);

export default router;
