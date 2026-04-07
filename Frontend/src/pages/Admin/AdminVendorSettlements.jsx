// pages/Admin/AdminVendorSettlements.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEligiblePayoutOrders,
  payVendor,
} from "../../api/AdminApi";
import toast from "react-hot-toast";

const AdminVendorSettlements = () => {
  const [payments, setPayments] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // fetch payouts
  const fetchPayouts = async () => {
    try {
      setLoading(true);

      const data = await getEligiblePayoutOrders({
        page,
        limit: 10,
      });

      setPayments(data.orders);
      setTotalPages(data.totalPages);

    } catch (err) {
      console.error("Fetch payouts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [page]);

  // payout handler
  const handlePayout = async () => {
    if (!selectedOrder) return;

    try {
      setProcessing(true);

      const promise = payVendor(selectedOrder._id);

      toast.promise(promise, {
        loading: "Processing payout...",
        success: "Vendor paid successfully",
        error: "Payout failed",
      });

      await promise;

      setSelectedOrder(null);
      fetchPayouts(); // refresh list

    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-extrabold mb-6">
        Vendor Settlements
      </h1>

      <div className="space-y-4">

        {loading && (
          <p className="text-gray-500 text-sm">
            Loading settlements...
          </p>
        )}

        {!loading && payments.length === 0 && (
          <p className="text-gray-500 text-sm">
            No eligible payouts.
          </p>
        )}

        {payments.map(payment => (
          <div
            key={payment._id}
            className="bg-white border border-gray-100 rounded-2xl p-4
            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <p className="font-semibold">
                {payment.product_id?.name}
              </p>

              <p className="text-sm text-gray-500">
                Vendor: {payment.vendor_id?.businessName}
              </p>

              <p className="text-sm text-gray-500">
                Quantity: {payment.quantity}
              </p>

              <p className="text-sm font-semibold text-indigo-600">
                ₹{payment.vendorEarning}
              </p>
            </div>

            <div className="flex items-center gap-4">

              <Link
                to={`/admin/orders/${payment.order_id}`}
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                View Order
              </Link>

              {payment.payout_status === "Paid" ? (
                <span className="px-3 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-lg">
                  Paid
                </span>
              ) : (
                <button
                  onClick={() => setSelectedOrder(payment)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold
    border border-indigo-200 text-indigo-700
    hover:bg-indigo-50 transition"
                >
                  Pay Vendor
                </button>
              )}
            </div>
          </div>
        ))}

      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
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

      {/* Confirmation Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">

            <h2 className="text-lg font-semibold">
              Confirm Vendor Payment
            </h2>

            <p className="text-sm text-gray-600">
              Pay{" "}
              <span className="font-semibold">
                {selectedOrder.vendor_id?.businessName}
              </span>{" "}
              for product{" "}
              <span className="font-semibold">
                {selectedOrder.product_id?.name}
              </span>
            </p>

            <p className="text-sm font-semibold text-indigo-600">
              Amount: ₹{selectedOrder.vendorEarning}
            </p>

            <div className="flex justify-end gap-3 pt-4">

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handlePayout}
                disabled={processing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                {processing ? "Processing..." : "Confirm Payment"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AdminVendorSettlements;