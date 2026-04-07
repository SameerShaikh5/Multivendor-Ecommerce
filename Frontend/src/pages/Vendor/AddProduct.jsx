import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../../api/VendorApi.jsx"
import toast from "react-hot-toast"

const AddProduct = () => {
  const navigate = useNavigate();

  // ===== FORM STATE =====
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const maxImages = 3;

  // ===== INPUT CHANGE =====
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===== IMAGE UPLOAD =====
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (imageFiles.length + files.length > maxImages) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // ===== REMOVE IMAGE =====
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== SUBMIT PRODUCT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);

      imageFiles.forEach((file) => {
        data.append("images", file); // must match multer field name
      });

      await createProduct(data);

      toast.success("Product created successfully!");
      navigate("/vendor/products");

    } catch (err) {
      console.error("Create product error", err);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-extrabold">Add Product</h1>

        <Link to="/vendor/products" className="text-sm text-gray-600 hover:underline">
          Back
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6"
      >

        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            required
            placeholder="Enter product name"
            className="input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Describe your product"
            className="input resize-none"
          />
        </div>

        {/* Price  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Price (₹)</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              required
              className="input"
            />
          </div>

          
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Select category</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Books</option>
            <option>Home</option>
            <option>Other</option>
          </select>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Product Images (Max 3)
          </label>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} className="w-full h-24 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {imageFiles.length < maxImages && (
            <>
              <label
                htmlFor="productImages"
                className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500 cursor-pointer hover:border-indigo-600 transition"
              >
                Click to upload new images
              </label>

              <input
                type="file"
                id="productImages"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus { border-color: #4f46e5; }
      `}</style>
    </div>
  );
};

export default AddProduct;