
export const TryCatch = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};


export const errorMiddleware = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Something went wrong";

  // console.log(err)
  return res.status(status).json({
    success: false,
    message
  });
};
