import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from "../api/AuthApi";
import { useCart } from "./CartContext.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const {fetchCart} = useCart()

  const healthCheck = async () => {
    try {
      const data = await getCurrentUser();

      if (data?.success) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    healthCheck();
  }, []);


  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);

      if (data?.success) {
        setUser(data.data);
        fetchCart()

        return {
          success: true,
          message: data.message,
        };
      }

      return {
        success: false,
        message: "Login failed",
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Invalid email or password",
      };
    }
  };


  const register = async (formData) => {
    try {
      const res = await registerUser(formData);

      setUser(res.data);


      return {
        success: true,
        message: res.message,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Registration failed",
      };
    }
  };


  const logout = async () => {
    try {
      await logoutUser();
      fetchCart()
      
      setUser(null);
    } catch (err) {
      console.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        healthCheck,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);