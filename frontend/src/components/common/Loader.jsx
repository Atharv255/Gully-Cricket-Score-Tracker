import React from "react";
import { MdSportsCricket } from "react-icons/md";
import clsx from "clsx";

const Loader = ({ size = "md", text = "", fullScreen = false, className = "" }) => {
  const sizeMap = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">
        <MdSportsCricket
          className={`text-cricket-green ${sizeMap[size]} animate-spin`}
        />
        {text && (
          <p className="text-gray-400 text-sm mt-4 animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col items-center justify-center py-12", className)}>
      <MdSportsCricket
        className={`text-cricket-green ${sizeMap[size]} animate-spin`}
      />
      {text && (
        <p className="text-gray-400 text-sm mt-3 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default Loader;