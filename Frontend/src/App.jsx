import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Layout from "./Layouts/Layout";
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { CartProvider } from './ContextApi/CartContext';
import Checkout from './pages/Checkout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthProvider } from './ContextApi/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import VendorSignup from './pages/VendorSignup';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MyOrders from './pages/Myorders';
import OrderDetails from './pages/OrderDetails';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import VendorProducts from './pages/Vendor/VendorProducts';
import VendorLayout from './Layouts/VendorLayout';
import VendorOrders from './pages/Vendor/VendorOrders';
import AddProduct from './pages/Vendor/AddProduct';
import EditProduct from './pages/Vendor/EditProduct';
import VendorOrderDetails from './pages/Vendor/VendorOrderDetails';
import AdminLayout from './Layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminVendorDetails from './pages/Admin/AdminVendorDetails';
import AdminVendors from './pages/Admin/AdminVendors';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminOrderDetails from './pages/Admin/AdminOrderDetails';
import AdminVendorSettlements from './pages/Admin/AdminVendorSettlements';
import AdminRefunds from './pages/Admin/AdminRefunds';
import ErrorPage from './components/ErrorPage';
import Unauthorized from './pages/Unauthorized';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OrderSuccess from './pages/OrderSuccess.jsx';




const queryClient = new QueryClient();



function App() {


  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/shop',
          element: <Shop />
        },
        {
          path: '/products/:productId',
          element: <ProductDetails />
        },
        {
          path: '/signup',
          element: <Signup />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/apply-as-vendor',
          element: <VendorSignup />
        },
        {
          path: '/profile',
          element: <ProtectedRoute >
            <Profile />
          </ProtectedRoute>
        },
        {
          path: '/edit-profile',
          element: <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        },
        {
          path: '/my-orders',
          element: <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        },
        {
          path: '/orders/:orderId',
          element: <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        },
        {
          path: '/cart',
          element: <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        },
        {
          path: '/checkout',
          element: <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        },
        {
          path: '/order-success',
          element: <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        },
        {
          path: '/unauthorized',
          element: <Unauthorized />
        },



        // 🔥 VENDOR ROUTES (NESTED)
        {
          path: "/vendor",
          element: (
            <ProtectedRoute allowedRoles={["Vendor"]}>
              <VendorLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "dashboard",
              element: <VendorDashboard />
            },
            {
              path: "products",
              element: <VendorProducts />
            },
            {
              path: "products/add",
              element: <AddProduct />
            },
            {
              path: "products/edit/:productId",
              element: <EditProduct />
            },
            {
              path: "orders",
              element: <VendorOrders />
            },
            {
              path: "orders/:orderId",
              element: <VendorOrderDetails />
            },

          ]

        },


        // Admin Routes
        {
          path: "/admin",
          element: (
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "dashboard",
              element: <AdminDashboard />
            },
            {
              path: "vendors",
              element: <AdminVendors />
            },
            {
              path: "vendors/:vendorId",
              element: <AdminVendorDetails />
            },
            {
              path: "orders",
              element: <AdminOrders />
            },
            {
              path: "orders/:orderId",
              element: <AdminOrderDetails />
            },
            {
              path: "vendor-settlements",
              element: <AdminVendorSettlements />
            },
            // {
            //   path: "refunds",
            //   element: <AdminRefunds />
            // },
          ]
        }

      ]
    },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <AuthProvider>
            <RouterProvider router={router} />,
          </AuthProvider>
        </CartProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
