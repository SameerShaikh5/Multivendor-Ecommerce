import axiosInstance from "../config/axiosInstance";

export const fetchProducts = async ({ pageParam = 1, queryKey }) => {
  const search = queryKey?.[1]?.search || "";

  const { data } = await axiosInstance.get(
    `/products?page=${pageParam}&search=${search}`
  );

  return data;
};



export const fetchProductById = async ({ queryKey }) => {
  const [, productId] = queryKey;

  const { data } = await axiosInstance.get(`/products/${productId}`);
  return data;
};



