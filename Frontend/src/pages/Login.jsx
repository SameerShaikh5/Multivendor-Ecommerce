import React, { useState } from 'react'
import "../styles/Signup.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../ContextApi/AuthContext';
import toast from "react-hot-toast";

const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    //  Login form state
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    //  Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //  Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.trim().length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        const res = await login(formData);

        setLoading(false);

        if (!res.success) {
            toast.error(res.message || "Login failed");
            return;
        }

        toast.success("Login successful ");

        // redirect after login
        navigate("/");
    };

    return (
        <>
            <main className="min-h-screen flex items-center justify-center px-4">

                <div className="bg-white border border-gray-100 rounded-3xl p-8 w-full max-w-md">

                    {/* Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600">
                            SHOPNEST
                        </h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Login to your account
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>

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

                        {/* Password */}
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="auth-input"
                            value={formData.password}
                            onChange={handleChange}
                        />



                        

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    {/* Footer */}
                    <p className="text-sm text-center text-gray-600 mt-6">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>

                </div>

            </main>
        </>
    )
}

export default Login;
