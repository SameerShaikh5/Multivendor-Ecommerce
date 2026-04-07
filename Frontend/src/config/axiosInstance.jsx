

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // if using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;