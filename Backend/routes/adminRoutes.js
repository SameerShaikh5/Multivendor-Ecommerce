import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import {
  approveVendor,
  getAdminDashboardStats,
  getAllVendors,
  getEligiblePayoutOrders,
  getOrderDetails,
  getOrders,
  getVendorDetails,
  payVendor,
  rejectVendor,
  searchVendors,
  updateOrderStatus
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", authMiddleware("Admin"), getAdminDashboardStats);

router.get("/vendors", authMiddleware("Admin"), getAllVendors);

router.get("/vendors/search", authMiddleware("Admin"), searchVendors);

router.get("/vendors/:vendorId", authMiddleware("Admin"), getVendorDetails);

router.patch("/vendors/approve/:vendorId" , authMiddleware("Admin"), approveVendor);

router.patch("/vendors/reject/:vendorId" , authMiddleware("Admin"), rejectVendor);



// all orders (paginated)
router.get("/orders", authMiddleware("Admin"), getOrders);


// order details
router.get("/orders/:orderId", authMiddleware("Admin"), getOrderDetails);


router.patch(
  "/orders/:orderId/status",
  authMiddleware("Admin"),
  updateOrderStatus
);

router.get(
  "/payouts/eligible",
  authMiddleware("Admin"),
  getEligiblePayoutOrders
);

router.post(
  "/payouts/:orderItemId/pay",
  authMiddleware("Admin"),
  payVendor
);



// router.get("/vendors/approve/:vendorId" , authMiddleware("Admin"), suspendVendor);


export const adminRoutes = router;
