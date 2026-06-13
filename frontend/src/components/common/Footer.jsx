import React from "react";
import { Link } from "react-router-dom";
import { MdSportsCricket } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MdSportsCricket className="text-cricket-green text-2xl" />
            <div>
              <p className="text-white font-bold text-sm">Gully Cricket</p>
              <p className="text-gray-500 text-xs">Live Score Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-300">
              Home
            </Link>
            <Link
              to="/admin/login"
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Admin
            </Link>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Gully Cricket Live Score Tracker
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;