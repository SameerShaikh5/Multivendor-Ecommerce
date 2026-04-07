import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600/10 p-6 rounded-full">
            <AlertTriangle className="text-indigo-600 w-10 h-10" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-8">
          The page you’re looking for doesn’t exist or an unexpected error occurred.
        </p>

        <button
          onClick={()=>navigate(-1)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition cursor-pointer m-5"
        >
          Go Back
        </button>
        <Link
          to="/"
          className=" px-6 py-3 rounded-xl font-semibold  border border-gray-400"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
