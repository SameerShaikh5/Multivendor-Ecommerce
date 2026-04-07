import React from 'react'

const Footer = () => {
  return (

    <>
    {/* <!-- ================= FOOTER ================= --> */}
    <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* <!-- Brand --> */}
                <div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-indigo-600 mb-3">
                        SHOPNEST
                    </h3>
                    <p className="text-sm text-gray-600 max-w-xs">
                        A modern ecommerce platform offering curated products designed for
                        everyday living.
                    </p>
                </div>

                {/* <!-- Shop --> */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                        Shop
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-indigo-600 transition">All Products</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition">Categories</a></li>
                        
                        <li><a href="#" className="hover:text-indigo-600 transition">Featured</a></li>
                    </ul>
                </div>

                {/* <!-- Account --> */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                        Account
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-indigo-600 transition">Profile</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition">Orders</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition">Cart</a></li>
                        
                    </ul>
                </div>

                {/* <!-- Support --> */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                        Support
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-indigo-600 transition">Help Center</a></li>
                        
                        <li><a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition">Terms & Conditions</a></li>
                    </ul>
                </div>

            </div>

            {/* <!-- Bottom --> */}
            <div className="border-t border-gray-100 mt-12 pt-6 text-center text-sm text-gray-500">
                © 2026 SHOPNEST. All rights reserved.
            </div>

        </div>
    </footer>
    </>
  )
}

export default Footer