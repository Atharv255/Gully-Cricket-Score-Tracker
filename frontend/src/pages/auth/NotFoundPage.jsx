import React from "react";
import { Link } from "react-router-dom";
import { MdSportsCricket, MdHome } from "react-icons/md";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <MdSportsCricket className="text-gray-700 text-8xl mx-auto mb-6 animate-spin" />
        <h1 className="text-6xl font-black text-gray-700 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Looks like this ball went for a wide! The page you're looking for
          doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 btn-primary"
        >
          <MdHome size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;