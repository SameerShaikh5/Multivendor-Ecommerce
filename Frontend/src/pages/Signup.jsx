import React, { useState } from 'react'
import "../styles/Signup.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../ContextApi/AuthContext.jsx";
import toast from "react-hot-toast";

const Signup = () => {

    const navigate = useNavigate()
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        contactNumber: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.trim().length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        const res = await register(formData);

        if (res.success) {
            toast.success("Account created successfully");
            navigate("/");
        } else {
            toast.error(res.message);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">

            <div className="bg-white border border-gray-100 rounded-3xl p-8 w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600">
                        SHOPNEST
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Create your account
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <input
                        type="text"
                        name="fullname"
                        placeholder="Full name"
                        required
                        className="auth-input"
                        value={formData.fullname}
                        onChange={handleChange}
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        required
                        className="auth-input"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    {/* Contact Number */}
                    <input
                        type="tel"
                        name="contactNumber"
                        placeholder="Contact number"
                        required
                        className="auth-input"
                        value={formData.contactNumber}
                        onChange={handleChange}
                    />

                    {/* Password (Visible) */}
                    <input
                        type="text"
                        name="password"
                        placeholder="Password"
                        required
                        className="auth-input"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition"
                    >
                        Create Account
                    </button>

                </form>

                <p className="text-sm text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        Login
                    </Link>
                </p>

            </div>

        </main>
    )
}

export default Signup;
