// layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import ScrollToTop from "../components/ScrollToTop";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <ScrollToTop />

      <AdminSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <main className="flex-1 px-6 py-8">

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-6 p-2 rounded-lg border border-gray-200"
        >
          ☰
        </button>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
