import VendorProfile from "../models/VendorProfile.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { TryCatch } from "./errorMiddleware.js";

export const vendorApprovedMiddleware = TryCatch(
  async (req, res, next) => {
    const vendorProfile = await VendorProfile.findOne({
      user_id: req.user._id
    })?.select("-password")

    if (!vendorProfile) {
      throw new ErrorHandler(403, "Vendor profile not found");
    }

    if (vendorProfile.status !== "Active") {
      throw new ErrorHandler(
        403,
        "Vendor account not approved yet. Wait for admin approval."
      );
    }

    req.vendorProfile = vendorProfile

    next();
  }
);

