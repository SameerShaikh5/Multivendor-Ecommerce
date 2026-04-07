import express from 'express';
import { getAllOrders, getOrderDetailsById, getVendorDashboardStats, getVendorProducts, getVendorProfile, markOrderShippedToFacility, registerVendor } from '../controllers/vendorController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { vendorApprovedMiddleware } from '../middlewares/vendorMiddleware.js';

const router = express.Router();

router.post('/register', registerVendor);

router.get(
  "/profile",
  authMiddleware(["Vendor"]),
  getVendorProfile
);

router.get(
  "/stats",
  authMiddleware(["Vendor"]),
  vendorApprovedMiddleware,
  getVendorDashboardStats
);


router.get('/orders', authMiddleware(["Vendor"]), vendorApprovedMiddleware, getAllOrders)

router.get('/orders/:orderItemId', authMiddleware(["Vendor"]),vendorApprovedMiddleware, getOrderDetailsById)

router.patch(
  "/orders/:orderItemId/ship",
  authMiddleware(["Vendor"]),
  vendorApprovedMiddleware,
  markOrderShippedToFacility
);


router.get("/products",authMiddleware(["Vendor"]),vendorApprovedMiddleware, getVendorProducts)



export const vendorRoutes = router;