import { Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { updateProfile } from "../api/authApi";
import { useAuth } from "../ContextApi/AuthContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // assuming you have this

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
  });

  /* ================= PREFILL USER ================= */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        contact: user.contact || "",
      });
    }
  }, [user]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (!formData.name || !formData.contact) {
      toast.error("All fields required");
      return false;
    }

    // phone validation (Indian)
    if (!/^[6-9]\d{9}$/.test(formData.contact)) {
      toast.error("Enter valid 10 digit phone number");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await updateProfile({
        name: formData.name,
        contact: formData.contact,
      });

      if (res.success) {
        toast.success(res.message || "Profile updated");

        // update global user state (important)
        setUser(res.data);

        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Profile update failed"
      );
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Edit Profile
        </h1>
        <p className="text-gray-600">Update your personal information</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              pattern="[6-9]{1}[0-9]{9}"
              title="Enter valid 10 digit phone number"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2 justify-center"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>

            <Link
              to="/profile"
              className="px-6 py-3 rounded-xl border border-gray-200 text-center font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
};

export default EditProfile;