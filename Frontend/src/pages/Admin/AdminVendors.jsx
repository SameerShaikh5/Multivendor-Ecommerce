// pages/Admin/AdminVendors.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchAdminVendors, getAdminVendors } from "../../api/AdminApi.jsx";


const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);

        let data;

        // if searching → use search API
        if (search.trim()) {
          data = await searchAdminVendors(search);

          // search API does not return pagination
          setVendors(data.vendors);
          setTotalPages(1);

        } else {
          // normal list API
          data = await getAdminVendors({
            page,
            limit: 10,
            status: statusFilter === "All" ? "" : statusFilter,
          });

          setVendors(data.vendors);
          setTotalPages(data.totalPages);
        }

      } catch (err) {
        console.error("Fetch vendors error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchVendors, 400);
    return () => clearTimeout(delay);

  }, [page, statusFilter, search]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Active":
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Suspended":
        return "bg-red-100 text-red-700";
      case "Rejected":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-extrabold">
          All Vendors
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          {/* Search */}
          <input
            type="text"
            placeholder="Search vendor name..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm
            w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm
            w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Active">Approved</option>
            <option value="Suspended">Suspended</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>
      </div>

      {/* Vendors List */}
      <div className="space-y-4">

        {loading && (
          <div className="text-sm text-gray-500">
            Loading vendors...
          </div>
        )}

        {!loading && vendors.length === 0 && (
          <div className="text-sm text-gray-500">
            No vendors found.
          </div>
        )}

        {vendors.map(vendor => (
          <div
            key={vendor._id}
            className="bg-white border border-gray-100 rounded-2xl p-4
            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h3 className="font-semibold">
                {vendor.businessName}
              </h3>
            </div>

            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(vendor.status)}`}
            >
              {vendor.status}
            </span>

            <Link
              to={`/admin/vendors/${vendor._id}`}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && !search && totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">

          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm flex items-center">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}
    </>
  );
};

export default AdminVendors;