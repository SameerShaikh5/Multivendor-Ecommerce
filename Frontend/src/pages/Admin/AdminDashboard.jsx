// pages/Admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, getAdminVendors } from "../../api/AdminApi.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // fetch stats + vendors
        const [statsData, vendorsData] = await Promise.all([
          getAdminStats(),
          getAdminVendors(1, 10),
        ]);

        setStats(statsData);

        // filter pending vendors (show only 3)
        const pending = vendorsData.vendors
          .filter(v => v.status?.toLowerCase() === "pending")
          .slice(0, 3);

        setPendingVendors(pending);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-extrabold">
          Admin Dashboard
        </h1>

        <span className="text-sm text-gray-500 hidden sm:block">
          Welcome, Admin
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Users"
          value={loading ? "—" : stats?.totalUsers}
        />
        <StatCard
          title="Total Vendors"
          value={loading ? "—" : stats?.totalVendors}
        />
        <StatCard
          title="Pending Vendors"
          value={loading ? "—" : stats?.pendingVendors}
          highlight="text-yellow-600"
        />
        <StatCard
          title="Total Orders"
          value={loading ? "—" : stats?.totalOrders}
          highlight="text-indigo-600"
        />
      </div>

      {/* Pending Vendors */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">
            Pending Vendor Applications
          </h2>

          <Link
            to="/admin/vendors?status=pending"
            className="text-sm text-indigo-600 hover:underline font-semibold"
          >
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && pendingVendors.length === 0 && (
            <p className="text-gray-500">No pending vendors</p>
          )}

          {pendingVendors.map(vendor => (
            <div
              key={vendor._id}
              className="border border-gray-100 rounded-xl p-4
              flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">
                  {vendor.businessName}
                </h3>

                <p className="text-xs text-gray-400">
                  Status: {vendor.status}
                </p>
              </div>

              <Link
                to={`/admin/vendors/${vendor._id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ title, value, highlight }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6">
    <p className="text-sm text-gray-500 mb-2">{title}</p>

    <p className={`text-2xl font-bold ${highlight || ""}`}>
      {value ?? "—"}
    </p>
  </div>
);

export default AdminDashboard;