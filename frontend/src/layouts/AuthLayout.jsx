import React from "react";
import { Outlet } from "react-router-dom";
import { MdSportsCricket } from "react-icons/md";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <MdSportsCricket className="text-cricket-green text-5xl mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Gully Cricket</h1>
          <p className="text-gray-400 text-sm mt-1">Live Score Tracker</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;