import axiosInstance from "../config/axiosInstance";

/* ================================
   CREATE ORDER
================================ */
export const createOrder = async (shippingData) => {
  const res = await axiosInstance.post(
    "/orders/create-order",
    shippingData
  );
  return res.data;
};

/* ================================
   VERIFY PAYMENT
================================ */
export const verifyPayment = async (paymentData) => {
  const res = await axiosInstance.post(
    "/orders/verify-payment",
    paymentData
  );
  return res.data;
};


export const getMyOrders = async () => {
  const res = await axiosInstance.get("/orders/my-orders");
  return res.data;
};

/* ================================
   GET ORDER DETAILS
================================ */
export const getOrderDetails = async (orderId) => {
  const res = await axiosInstance.get(`/orders/${orderId}`);
  return res.data;
};