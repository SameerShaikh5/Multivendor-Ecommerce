// pages/Admin/AdminRefunds.jsx
import React, { useState } from "react";

const AdminRefunds = () => {

  const [filter, setFilter] = useState("all");
  const [processing, setProcessing] = useState(false);

  const [refunds, setRefunds] = useState([
    {
      orderId: "ORD992211",
      customer: "Rahul Sharma",
      amount: "₹2,999",
      reason: "Product damaged during delivery",
      status: "pending"
    },
    {
      orderId: "ORD991890",
      customer: "Ankit Verma",
      amount: "₹1,499",
      reason: "Wrong item delivered",
      status: "refunded",
      refundId: "rfnd_82ks91js9"
    }
  ]);

  // Refund Confirmation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

  // View Details Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRefund, setViewRefund] = useState(null);

  const filteredRefunds = refunds.filter(r => {
    if (filter === "pending") return r.status === "pending";
    if (filter === "refunded") return r.status === "refunded";
    return true;
  });

  const openModal = (refund) => {
    setSelectedRefund(refund);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRefund(null);
    setIsModalOpen(false);
  };

  const openViewModal = (refund) => {
    setViewRefund(refund);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewRefund(null);
    setIsViewModalOpen(false);
  };

  const handleRefund = async () => {
    if (!selectedRefund) return;

    setProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setRefunds(prev =>
        prev.map(r =>
          r.orderId === selectedRefund.orderId
            ? {
                ...r,
                status: "refunded",
                refundId: "rfnd_" + Math.random().toString(36).slice(2)
              }
            : r
        )
      );

      closeModal();

    } catch (err) {
      console.log(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-extrabold">
          Cancelled Orders – Refunds
        </h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All</option>
          <option value="pending">Refund Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Refund List */}
      <div className="space-y-4">
        {filteredRefunds.map(refund => (
          <div
            key={refund.orderId}
            className={`bg-white border border-gray-100 rounded-2xl p-4
            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
            ${refund.status === "refunded" ? "opacity-70" : ""}`}
          >
            <div>
              <p className="font-semibold">
                #{refund.orderId}
              </p>

              <p className="text-sm text-gray-500">
                Customer: {refund.customer}
              </p>

              <p className="text-sm text-gray-500">
                Amount: {refund.amount}
              </p>

              {refund.status === "pending" && (
                <p className="text-xs text-orange-500 font-semibold">
                  Status: Refund Pending
                </p>
              )}

              {refund.status === "refunded" && (
                <p className="text-xs text-gray-400">
                  Refund ID: {refund.refundId}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

              {/* UPDATED VIEW BUTTON */}
              <button
                onClick={() => openViewModal(refund)}
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                View Details
              </button>

              {refund.status === "pending" ? (
                <button
                  onClick={() => openModal(refund)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold
                  bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Send Refund
                </button>
              ) : (
                <span
                  className="inline-flex px-3 py-1 rounded-full text-xs font-semibold
                  bg-green-100 text-green-700"
                >
                  Refunded
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= CONFIRM REFUND MODAL ================= */}
      {isModalOpen && selectedRefund && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Confirm Refund</h2>

            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p><strong>Order:</strong> #{selectedRefund.orderId}</p>
              <p><strong>Customer:</strong> {selectedRefund.customer}</p>
              <p className="text-red-600 font-semibold">
                Amount: {selectedRefund.amount}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleRefund}
                disabled={processing}
                className="px-4 py-2 rounded-lg text-sm font-semibold
                bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {processing ? "Processing..." : "Confirm Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW DETAILS MODAL ================= */}
      {isViewModalOpen && viewRefund && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">

            <h2 className="text-lg font-semibold">
              Refund Details
            </h2>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <p><strong>Order ID:</strong> #{viewRefund.orderId}</p>
              <p><strong>Customer:</strong> {viewRefund.customer}</p>
              <p><strong>Amount:</strong> {viewRefund.amount}</p>
              <p><strong>Reason:</strong> {viewRefund.reason}</p>
              <p>
                <strong>Status:</strong>{" "}
                {viewRefund.status === "pending"
                  ? "Refund Pending"
                  : "Refunded"}
              </p>

              {viewRefund.status === "refunded" && (
                <p><strong>Refund ID:</strong> {viewRefund.refundId}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default AdminRefunds;
