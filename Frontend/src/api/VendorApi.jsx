import axiosInstance from "../config/axiosInstance";



// ===== GET VENDOR STATS =====
export const getVendorStats = async () => {
  const { data } = await axiosInstance.get("/vendors/stats");
  return data.data; // only return actual data
};


// ===== GET VENDOR ORDERS =====
export const getVendorOrders = async () => {
  const { data } = await axiosInstance.get("/vendors/orders");
  return data.data; // only return actual data
};


// get single order details
export const getVendorOrderDetails = async (id) => {
  const { data } = await axiosInstance.get(`/vendors/orders/${id}`);
  return data.data;
};

// mark shipped to facility center
export const markOrderShipped = async (id) => {
  const { data } = await axiosInstance.patch(`/vendors/orders/${id}/ship`);
  return data;
};


// ===== GET VENDOR PRODUCTS WITH PAGINATION =====
export const getVendorProducts = async (page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(
    `/vendors/products?page=${page}&limit=${limit}`
  );

  return data; // return full response (pagination info needed)
};


export const updateProduct = async (id, formData) => {
  const { data } = await axiosInstance.patch(
    `/products/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data.data;
};


// ===== CREATE PRODUCT =====
export const createProduct = async (formData) => {
  const { data } = await axiosInstance.post(
    "/products/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// ===== DEACTIVATE PRODUCT =====
export const deactivateProduct = async (id) => {
  const { data } = await axiosInstance.patch(
    `/products/deactivate/${id}`
  );

  return data;
};



export const registerVendor = async (formData) => {
  // map frontend fields → backend fields
  const payload = {
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    contact: formData.phone,
    password: formData.password,
    businessName: formData.businessName,
    businessAddress: formData.address,
    bankAccountNumber: formData.bankAccount,
    ifscCode: formData.ifsc.toUpperCase(),
  };

  const { data } = await axiosInstance.post(
    "/vendors/register",
    payload
  );

  return data;
};