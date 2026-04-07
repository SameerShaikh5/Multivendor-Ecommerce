import React from 'react'
import {  useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate()
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-extrabold text-red-600 mb-4">
        Unauthorized
      </h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to access this page.
      </p>

      <button
        onClick={()=>navigate(-1)}
        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition"
      >
        Go Back
      </button>
    </main>
  );
};

export default Unauthorized;
