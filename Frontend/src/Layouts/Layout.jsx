import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'
import { Toaster } from "react-hot-toast";


const Layout = () => {


  return (
    <>
      <div className='bg-gray-50 text-gray-900'>

        {/* toast notification */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "rounded-xl",
          }}
        />

        <ScrollToTop />
        <Navbar />

        {/* page */}
        <Outlet />


        <Footer />

      </div>
    </>
  )
}

export default Layout