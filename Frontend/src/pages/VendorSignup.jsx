import React, { useState } from "react";
import "../styles/VendorSignup.css";
import { registerVendor } from "../api/VendorApi.jsx";
import toast from "react-hot-toast";

const VendorSignup = () => {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    address: "",
    bankAccount: "",
    ifsc: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Basic validation
  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name required";
    if (!formData.lastName) newErrors.lastName = "Last name required";

    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.businessName)
      newErrors.businessName = "Business name required";

    if (!formData.address)
      newErrors.address = "Address required";

    if (!/^\d+$/.test(formData.bankAccount))
      newErrors.bankAccount = "Account number must be numeric";

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc))
      newErrors.ifsc = "Invalid IFSC code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const promise = registerVendor(formData);

      toast.promise(promise, {
        loading: "Submitting application...",
        success: (res) =>
          res.message || "Vendor registered successfully!",
        error: (err) =>
          err.response?.data?.message || "Registration failed",
      });

      await promise;

      // reset form after success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        address: "",
        bankAccount: "",
        ifsc: ""
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 w-full max-w-lg">

        <h1 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">
          Apply as Vendor
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Account */}
          <input name="firstName" placeholder="First Name" className="vendor-input" onChange={handleChange} />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}

          <input name="lastName" placeholder="Last Name" className="vendor-input" onChange={handleChange} />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}

          <input name="email" placeholder="Email" className="vendor-input" onChange={handleChange} />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

          <input name="phone" placeholder="Phone Number" className="vendor-input" onChange={handleChange} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}

          <input type="password" name="password" placeholder="Password" className="vendor-input" onChange={handleChange} />
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}

          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="vendor-input" onChange={handleChange} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}

          {/* Business */}
          <input name="businessName" placeholder="Business Name" className="vendor-input" onChange={handleChange} />
          {errors.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}



          <textarea name="address" rows="3" placeholder="Business Address"
            className="vendor-input resize-none" onChange={handleChange} />
          {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}

          {/* Bank */}
          <input name="bankAccount" placeholder="Bank Account Number" className="vendor-input" onChange={handleChange} />
          {errors.bankAccount && <p className="text-xs text-red-500">{errors.bankAccount}</p>}

          <input name="ifsc" placeholder="IFSC Code" className="vendor-input" onChange={handleChange} />
          {errors.ifsc && <p className="text-xs text-red-500">{errors.ifsc}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Create Vendor Account"}
          </button>

        </form>
      </div>
    </main>
  );
};

export default VendorSignup;
