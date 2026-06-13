import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  MdSportsCricket,
  MdMenu,
  MdClose,
  MdLiveTv,
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsAdmin,
} from "../../features/auth/authSlice";
import useDarkMode from "../../hooks/useDarkMode";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <MdSportsCricket className="text-cricket-green text-3xl group-hover:rotate-12 transition-transform duration-300" />
            <div>
              <p className="text-white font-bold text-base leading-tight">
                Gully Cricket
              </p>
              <p className="text-gray-500 text-xs leading-tight">
                Live Score Tracker
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-cricket-green"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-400 hover:text-white transition-all p-2 rounded-lg hover:bg-gray-800 active:scale-90"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <MdLightMode size={20} className="text-amber-400" />
              ) : (
                <MdDarkMode size={20} className="text-blue-400" />
              )}
            </button>

            {isAdmin && isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="btn-primary text-sm py-1.5 px-4"
              >
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors border border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-500"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-400 hover:text-white transition-all p-2 rounded-lg hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <MdLightMode size={20} className="text-amber-400" />
              ) : (
                <MdDarkMode size={20} className="text-blue-400" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-2 animate-slide-in">
            <NavLink
              to="/"
              end
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            >
              Home
            </NavLink>

            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-cricket-green font-medium"
              >
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Admin Login
              </Link>
            )}

            {/* Theme indicator in mobile */}
            <div className="px-4 py-2 flex items-center justify-between border-t border-gray-800 mt-2 pt-3">
              <span className="text-xs text-gray-500">Theme</span>
              <span className="text-xs font-semibold text-cricket-green">
                {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;