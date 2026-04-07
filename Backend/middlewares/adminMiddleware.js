export const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler(403, "Admin access required"));
  }
  next();
};
