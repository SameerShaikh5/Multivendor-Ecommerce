import express from "express";
import { checkLogin, getUserProfile, login, logout, register, updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/register", register)

router.post("/login", login)

router.get("/logout", authMiddleware(["User", "Vendor", "Admin"]) ,logout)

router.get("/me",authMiddleware(["User", "Vendor", "Admin"]), checkLogin)

router.get("/profile", authMiddleware(["User", "Vendor", "Admin"]), getUserProfile)

router.patch("/profile", authMiddleware(["User", "Vendor", "Admin"]), updateUser)

export const userRoutes = router