

import axiosInstance from "../config/axiosInstance.jsx"


// get dashboard stats
export const getAdminStats = async () => {
  const { data } = await axiosInstance.get("/admin/stats");
  return data.stats;
};

// get vendors list
export const getAdminVendors = async ({
  page = 1,
  limit = 10,
  status = "",
  search = "",
}) => {
  const { data } = await axiosInstance.get(
    `/admin/vendors?page=${page}&limit=${limit}&status=${status}&search=${search}`
  );

  return data;
};

// search vendors
export const searchAdminVendors = async (query) => {
  if (!query) return { vendors: [] };

  const { data } = await axiosInstance.get(
    `/admin/vendors/search?q=${query}`
  );

  return data;
};


// get single vendor details
export const getAdminVendorById = async (vendorId) => {
  const { data } = await axiosInstance.get(`/admin/vendors/${vendorId}`);
  return data.vendor;
};

// approve vendor
export const approveVendor = async (vendorId) => {
  const { data } = await axiosInstance.patch(
    `/admin/vendors/approve/${vendorId}`
  );
  return data;
};

// reject vendor
export const rejectVendor = async (vendorId) => {
  const { data } = await axiosInstance.patch(
    `/admin/vendors/reject/${vendorId}`
  );
  return data;
};


// get all orders (admin)
export const getAdminOrders = async ({
  page = 1,
  limit = 10,
  status = "",
}) => {
  let url = `/admin/orders?page=${page}&limit=${limit}`;

  // backend expects order_status
  if (status) {
    url += `&order_status=${encodeURIComponent(status)}`;
  }

  const { data } = await axiosInstance.get(url);
  return data;
};


// get single order
export const getAdminOrderById = async (orderId) => {
  const { data } = await axiosInstance.get(`/admin/orders/${orderId}`);
  return data;
};

// update order status
export const updateAdminOrderStatus = async (orderId) => {
  const { data } = await axiosInstance.patch(
    `/admin/orders/${orderId}/status`
  );
  return data;
};


// get eligible payout orders
export const getEligiblePayoutOrders = async ({
  page = 1,
  limit = 10,
}) => {
  const { data } = await axiosInstance.get(
    `/admin/payouts/eligible?page=${page}&limit=${limit}`
  );

  return data;
};

// pay vendor
export const payVendor = async (orderItemId) => {
  const { data } = await axiosInstance.post(
    `/admin/payouts/${orderItemId}/pay`
  );

  return data;
};