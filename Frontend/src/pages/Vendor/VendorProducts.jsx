import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getVendorProducts,
  deactivateProduct,
} from "../../api/VendorApi.jsx";
import toast from "react-hot-toast";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const limit = 5;

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const data = await getVendorProducts(page, limit);

      const formattedProducts = data.products.map((item) => ({
        id: item._id,
        name: item.name,
        price: `₹${item.price?.toLocaleString()}`,
        category: item.category || "General",
        status: item.isActive ? "Active" : "Inactive",
        statusColor: item.isActive ? "green" : "yellow",
        image: item.images?.[0]?.secure_url,
      }));

      setProducts(formattedProducts);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch vendor products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  /* ================= OPEN MODAL ================= */
  const handleDeactivateClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  /* ================= CONFIRM DEACTIVATE ================= */
  const confirmDeactivate = async () => {
    try {
      setIsDeactivating(true);

      await toast.promise(deactivateProduct(selectedProductId), {
        loading: "Deactivating product...",
        success: (res) => res?.message || "Product deactivated!",
        error: (err) =>
          err?.response?.data?.message || "Failed to deactivate product",
      });

      setIsModalOpen(false);
      fetchProducts();

    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex text-gray-900">
      <main className="flex-1 px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <h1 className="text-2xl font-extrabold">Products</h1>

          <Link
            to={"/vendor/products/add"}
            className="w-fit sm:w-auto self-start sm:self-auto bg-gray-900 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-indigo-600 transition shadow-sm hover:shadow-md"
          >
            Add Product +
          </Link>
        </div>

        {/* ================= PRODUCT LIST ================= */}
        <div className="space-y-4">
          {products.length === 0 && (
            <p className="text-gray-500 text-sm">No products found.</p>
          )}

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Image */}
              {product.image ? (
                <img
                  src={product.image}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-xl" />
              )}

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.price}</p>
                <p className="text-xs text-gray-400">
                  Category: {product.category}
                </p>
              </div>

              {/* Status */}
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${product.statusColor === "green"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {product.status}
              </span>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to={`/vendor/products/edit/${product.id}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Edit
                </Link>

                {/* deactivate button */}
                <button
                  onClick={() => handleDeactivateClick(product.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Inactive
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm font-semibold">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* ================= CONFIRM MODAL ================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-2">
                Confirm Deactivation
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to deactivate this product?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  disabled={isDeactivating}
                  onClick={confirmDeactivate}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeactivating ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default VendorProducts;