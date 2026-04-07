import express from 'express';
import { createOrder, getUserOrderDetails, getUserOrders, verifyPayment } from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/my-orders", authMiddleware(["User" ,"Vendor", "Admin"]), getUserOrders)

router.get("/:orderId", authMiddleware(["User" ,"Vendor", "Admin"]), getUserOrderDetails)


router.post('/create-order', authMiddleware(["User" ,"Vendor", "Admin"]), createOrder)

router.post('/verify-payment', authMiddleware(["User" ,"Vendor", "Admin"]), verifyPayment)



export const orderRoutes = router;