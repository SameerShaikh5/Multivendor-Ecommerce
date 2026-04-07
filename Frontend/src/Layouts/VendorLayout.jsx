import { Outlet } from "react-router-dom";
import { useState } from "react";
import VendorSidebar from "../components/VendorSidebar";
import ScrollToTop from "../components/ScrollToTop";

const VendorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <ScrollToTop />

      <VendorSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <main className="flex-1 px-6 py-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 p-2 rounded-lg border border-gray-200"
        >
          ☰
        </button>

        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;
