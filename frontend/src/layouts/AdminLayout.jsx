import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdSportsCricket,
  MdHistory,
  MdGroup,
  MdPerson,
  MdMenu,
  MdClose,
  MdLogout,
  MdAdd,
} from "react-icons/md";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const navItems = [
  { to: "/admin/dashboard", icon: MdDashboard, label: "Dashboard" },
  { to: "/admin/create-match", icon: MdAdd, label: "Create Match" },
  { to: "/admin/history", icon: MdHistory, label: "Match History" },
  { to: "/admin/teams", icon: MdGroup, label: "Teams" },
  { to: "/admin/players", icon: MdPerson, label: "Players" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-30 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <MdSportsCricket className="text-cricket-green text-2xl" />
            <div>
              <p className="text-white font-bold text-sm">Gully Cricket</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cricket-green flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {user?.username || "Admin"}
              </p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
            Navigation
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-cricket-green text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950 hover:text-red-300 transition-all w-full"
          >
            <MdLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <MdMenu size={22} />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <MdSportsCricket className="text-cricket-green text-xl" />
            <span className="text-white font-bold text-sm">Gully Cricket</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-cricket-green text-white px-2 py-1 rounded-full font-bold">
              ADMIN
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;