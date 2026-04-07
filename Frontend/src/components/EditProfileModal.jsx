import React, { useState } from "react";

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    contactNumber: user.contactNumber || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            className="auth-input"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="contactNumber"
            placeholder="Contact Number"
            className="auth-input"
            value={formData.contactNumber}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white font-semibold hover:bg-indigo-600"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;
