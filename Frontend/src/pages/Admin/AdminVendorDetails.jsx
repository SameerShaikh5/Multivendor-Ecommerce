
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getAdminVendorById,
  approveVendor, rejectVendor
} from "../../api/AdminApi.jsx";
import toast from "react-hot-toast";

const AdminVendorDetails = () => {
  const { vendorId } = useParams();

  const [vendor, setVendor] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // fetch vendor
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);

        const data = await getAdminVendorById(vendorId);
        setVendor(data);
        setStatus(data.status);

      } catch (err) {
        console.error("Vendor fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  // update vendor status
  const handleApprove = async () => {
    try {
      setUpdating(true);

      const promise = approveVendor(vendorId);

      toast.promise(promise, {
        loading: "Approving vendor...",
        success: "Vendor approved successfully",
        error: "Failed to approve vendor",
      });

      await promise;
      setStatus("Active");

    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    try {
      setUpdating(true);

      const promise = rejectVendor(vendorId);

      toast.promise(promise, {
        loading: "Rejecting vendor...",
        success: "Vendor rejected",
        error: "Failed to reject vendor",
      });

      await promise;
      setStatus("Rejected");

    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Active":
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-rose-100 text-rose-700";
      case "Suspended":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p>Loading vendor...</p>;
  if (!vendor) return <p>Vendor not found</p>;

  return (
    <div className="max-w-3xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">
          Vendor Details
        </h1>

        <Link
          to="/admin/vendors"
          className="text-sm text-gray-600 hover:underline"
        >
          Back
        </Link>
      </div>

      {/* Vendor Status Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h2 className="font-semibold">
            {vendor.businessName}
          </h2>

          <p className="text-sm text-gray-500">
            {vendor.user?.name}
          </p>
        </div>

        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle()}`}
        >
          {status}
        </span>
      </div>

      {/* Business Information */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">
          Business Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p><strong>Owner Name:</strong> {vendor.user?.name}</p>
          <p><strong>Email:</strong> {vendor.user?.email}</p>
          <p><strong>Bank Account:</strong> {vendor.bankAccountNumber}</p>
          <p><strong>IFSC Code:</strong> {vendor.ifscCode}</p>

          <p className="sm:col-span-2">
            <strong>Created At:</strong>{" "}
            {new Date(vendor.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-semibold mb-6">
          Admin Actions
        </h2>

        <div className="flex flex-wrap gap-3">

          {status === "Pending" && (
            <>
              <button
                disabled={updating}
                onClick={handleApprove}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold
      border border-green-200 text-green-700
      hover:bg-green-50 transition disabled:opacity-50"
              >
                ✓ Approve
              </button>

              <button
                disabled={updating}
                onClick={handleReject}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold
      border border-rose-200 text-rose-700
      hover:bg-rose-50 transition disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}
          {(status === "Active" || status === "Approved") && (
            <button
              disabled={updating}
              onClick={() => handleStatusUpdate("Suspended")}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold
              border border-gray-300 text-gray-700
              hover:bg-gray-50 transition disabled:opacity-50"
            >
              Suspend Vendor
            </button>
          )}

          {status === "Suspended" && (
            <button
              disabled={updating}
              onClick={() => handleStatusUpdate("Active")}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold
              border border-green-200 text-green-700
              hover:bg-green-50 transition disabled:opacity-50"
            >
              Reactivate Vendor
            </button>
          )}

        </div>
      </div>

      <div className="text-xs text-gray-500">
        All actions are logged for audit purposes.
      </div>
    </div>
  );
};

export default AdminVendorDetails;