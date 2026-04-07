import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/VendorApi.jsx";
import toast from "react-hot-toast"

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const maxImages = 3;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [images, setImages] = useState([]); // preview images
  const [existingImages, setExistingImages] = useState([]); // from DB
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(productId);

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
        });

        setExistingImages(product.images || []);
        setImages(product.images?.map(img => img.secure_url) || []);
      } catch (err) {
        console.error("Fetch product error", err);
      }
    };

    fetchProduct();
  }, [productId]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > maxImages) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    setNewImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  /* ================= REMOVE IMAGE ================= */
  const removeImage = (index) => {
    // if removing existing image → track public_id
    if (index < existingImages.length) {
      setRemovedImages(prev => [
        ...prev,
        existingImages[index].public_id
      ]);

      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // removing newly uploaded image
      const newIndex = index - existingImages.length;
      setNewImageFiles(prev => prev.filter((_, i) => i !== newIndex));
    }

    setImages(prev => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);

      // send removed images
      if (removedImages.length > 0) {
        data.append("removedImages", JSON.stringify(removedImages));
      }

      // send new images
      newImageFiles.forEach(file => {
        data.append("images", file);
      });

      await updateProduct(productId, data);

      toast.success("Product updated successfully!");
      navigate("/vendor/products");

    } catch (err) {
      console.error("Update product error", err);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-extrabold">Edit Product</h1>

        <Link to="/vendor/products" className="text-sm text-gray-600 hover:underline">
          Back
        </Link>
      </div>

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
            required
            className="input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="input resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="input"
          />
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

          {images.length < maxImages && (
            <>
              <label
                htmlFor="productImages"
                className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500 cursor-pointer hover:border-indigo-600 transition"
              >
                Upload More Images
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

        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Product"}
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

export default EditProduct;