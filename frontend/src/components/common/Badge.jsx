import React from "react";
import clsx from "clsx";

const variants = {
  live: "bg-red-950 text-red-400 border-red-800",
  upcoming: "bg-blue-950 text-blue-400 border-blue-800",
  completed: "bg-green-950 text-green-400 border-green-800",
  abandoned: "bg-gray-900 text-gray-400 border-gray-700",
  default: "bg-gray-800 text-gray-300 border-gray-700",
  success: "bg-green-950 text-green-400 border-green-800",
  warning: "bg-amber-950 text-amber-400 border-amber-800",
  danger: "bg-red-950 text-red-400 border-red-800",
};

const Badge = ({ children, variant = "default", pulse = false, className = "" }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border",
        variants[variant],
        pulse && "animate-pulse",
        className
      )}
    >
      {variant === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      )}
      {children}
    </span>
  );
};

export default Badge;