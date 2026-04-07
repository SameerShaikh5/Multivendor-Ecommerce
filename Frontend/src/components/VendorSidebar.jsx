import React from "react";
import { Link, NavLink } from "react-router-dom";

const VendorSidebar = ({ isOpen, closeSidebar }) => {

  const ActiveLinkClass =({isActive})=>(
    isActive ? "block px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600": "block px-4 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
  )
  return (
    <>
      {/* Backdrop (Mobile) */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100
        flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm font-semibold">
          <NavLink
            to={"/vendor/dashboard"}
            className={ActiveLinkClass}
          >
            Dashboard
          </NavLink>
          <NavLink
            to={"/vendor/products"}
            className={ActiveLinkClass}
          >
            Products
          </NavLink>
          <NavLink
            to={"/vendor/orders"}
            className={ActiveLinkClass}
          >
            Orders
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full text-sm text-red-500 font-semibold hover:underline">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default VendorSidebar;
