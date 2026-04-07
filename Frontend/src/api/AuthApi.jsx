import axiosInstance from "../config/axiosInstance";


export const registerUser = async (formData) => {
  const payload = {
    name: formData.fullname, // map to backend
    email: formData.email,
    contact: formData.contactNumber, // map to backend
    password: formData.password,
  };

  const { data } = await axiosInstance.post("/users/register", payload);

  return data;
};


export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("/users/login", credentials);
  return data;
};



export const logoutUser = async () => {
  const { data } = await axiosInstance.get("/users/logout");
  return data;
};


export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/users/me");
  return data;
};




export const updateProfile = async (data) => {
  const res = await axiosInstance.patch("/users/profile", data);
  return res.data;
};