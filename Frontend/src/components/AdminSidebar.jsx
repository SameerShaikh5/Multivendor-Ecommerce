// components/AdminSidebar.jsx
import { Link, NavLink } from "react-router-dom";

const AdminSidebar = ({ isOpen, closeSidebar }) => {

  const activeClass = ({ isActive }) =>
    isActive
      ? "block px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600"
      : "block px-4 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600";

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
          <NavLink to="/admin/dashboard" className={activeClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/vendors" className={activeClass}>
            Vendors
          </NavLink>
          <NavLink to="/admin/orders" className={activeClass}>
            Orders
          </NavLink>
          <NavLink to="/admin/vendor-settlements" className={activeClass}>
            Vendor Settlements
          </NavLink>
          {/* <NavLink to="/admin/refunds" className={activeClass}>
            Refunds
          </NavLink> */}
          
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100 text-center">
          <Link className="text-md text-red-500 text-center font-semibold hover:underline">
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
