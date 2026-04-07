import React, { useState } from 'react'
import { ShoppingCart, MenuIcon } from "lucide-react";
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../ContextApi/CartContext';
import { useAuth } from '../ContextApi/AuthContext';

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const { cartItems } = useCart();
    const { user, logout } = useAuth();

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleActiveLink = ({ isActive }) =>
        `transition text-sm ${
            isActive
                ? "text-indigo-600 font-semibold"
                : "text-gray-900 hover:text-indigo-600"
        }`;

    return (
        <>
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-extrabold tracking-tight text-indigo-600">
                        SHOPNEST
                    </Link>

                    {/* Center Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold absolute left-1/2 -translate-x-1/2">

                        <NavLink to="/" className={handleActiveLink}>Home</NavLink>
                        <NavLink to="/shop" className={handleActiveLink}>Shop</NavLink>

                        {/* 🔐 Auth-based links */}
                        {!user && (
                            <>
                                <NavLink to="/login" className={handleActiveLink}>Login</NavLink>
                                <NavLink to="/signup" className={handleActiveLink}>Signup</NavLink>
                                <NavLink to="/apply-as-vendor" className={handleActiveLink}>Apply as Vendor</NavLink>
                            </>
                        )}

                        {user && (
                            <>
                                <NavLink to="/profile" className={handleActiveLink}>Profile</NavLink>

                                {/* 🧑‍💼 Role-based dashboards */}
                                {user.role === "Vendor" && (
                                    <NavLink to="/vendor/dashboard" className={handleActiveLink}>
                                        Vendor Dashboard
                                    </NavLink>
                                )}

                                {user.role === "Admin" && (
                                    <NavLink to="/admin/dashboard" className={handleActiveLink}>
                                        Admin Dashboard
                                    </NavLink>
                                )}

                                <button
                                    onClick={logout}
                                    className="text-sm text-gray-900 hover:text-red-600 transition cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        <NavLink to="/cart" className="relative">
                            <ShoppingCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>

                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                            <MenuIcon />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${isOpen ? '' : 'hidden'} md:hidden border-t border-gray-100 bg-white`}>
                    <nav className="px-4 py-4 flex flex-col gap-4 text-sm font-semibold">

                        <NavLink to="/" className={handleActiveLink}>Home</NavLink>
                        <NavLink to="/shop" className={handleActiveLink}>Shop</NavLink>

                        {!user && (
                            <>
                                <NavLink to="/login" className={handleActiveLink}>Login</NavLink>
                                <NavLink to="/signup" className={handleActiveLink}>Signup</NavLink>
                                <NavLink to="/apply-as-vendor" className={handleActiveLink}>Apply as Vendor</NavLink>
                            </>
                        )}

                        {user && (
                            <>
                                <NavLink to="/profile" className={handleActiveLink}>Profile</NavLink>

                                {user.role === "Vendor" && (
                                    <NavLink to="/vendor/dashboard" className={handleActiveLink}>
                                        Vendor Dashboard
                                    </NavLink>
                                )}

                                {user.role === "Admin" && (
                                    <NavLink to="/admin/dashboard" className={handleActiveLink}>
                                        Admin Dashboard
                                    </NavLink>
                                )}

                                <button
                                    onClick={logout}
                                    className="text-left text-sm text-gray-900 hover:text-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </nav>
                </div>
            </header>
        </>
    );
};

export default Navbar;
