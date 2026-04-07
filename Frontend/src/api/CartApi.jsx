import axiosInstance from "../config/axiosInstance";

/* ================================
   GET USER CART
================================ */
export const getCart = async () => {
  const { data } = await axiosInstance.get("/cart");
  return data;
};

/* ================================
   ADD TO CART
================================ */
export const addToCart = async ({ product_id, quantity }) => {
  const { data } = await axiosInstance.post("/cart", {
    product_id,
    quantity,
  });
  return data;
};

/* ================================
   INCREASE QUANTITY
================================ */
export const increaseCartItem = async (productId) => {
  const { data } = await axiosInstance.patch(
    `/cart/increase/${productId}`
  );
  return data;
};

/* ================================
   DECREASE QUANTITY
================================ */
export const decreaseCartItem = async (productId) => {
  const { data } = await axiosInstance.patch(
    `/cart/decrease/${productId}`
  );
  return data;
};

/* ================================
   REMOVE ITEM FROM CART
================================ */
export const removeCartItem = async (productId) => {
  const { data } = await axiosInstance.delete(`/cart/${productId}`);
  return data;
};
