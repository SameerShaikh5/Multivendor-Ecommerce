import { Edit, Package, LogOut, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../ContextApi/AuthContext";

const Profile = () => {
    const navigate = useNavigate();

    // Later replace with AuthContext / API data
    const { user, logout } = useAuth()

    const handleLogout = () => {
        console.log("User logged out");

        logout()
        navigate("/login");
    };

    return (
        <>
            {/* ================= PROFILE ================= */}
            <main className="max-w-4xl mx-auto px-4 py-16">

                <h1 className="text-3xl font-extrabold tracking-tight mb-8">
                    My Account
                </h1>

                {/* Profile Card */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-extrabold text-xl">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {user.name}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Edit Profile */}
                        <Link
                            to="/edit-profile"
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Account Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* My Orders */}
                    <Link
                        to="/my-orders"
                        className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between hover:border-indigo-600 hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-600/10 p-3 rounded-xl">
                                <Package className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">My Orders</h3>
                                <p className="text-sm text-gray-600">
                                    Track & view your purchases
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="bg-white border border-red-200 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-red-100 p-3 rounded-xl">
                                <LogOut className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-600">
                                    Logout
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Sign out of your account
                                </p>
                            </div>
                        </div>
                    </button>

                </div>
            </main>
        </>


    );
};

export default Profile;
