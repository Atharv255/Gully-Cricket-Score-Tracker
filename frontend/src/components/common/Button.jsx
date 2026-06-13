import React from "react";
import clsx from "clsx";

const variants = {
  primary: "bg-cricket-green hover:bg-cricket-darkgreen text-white border-transparent",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white border-transparent",
  danger: "bg-red-600 hover:bg-red-700 text-white border-transparent",
  warning: "bg-amber-500 hover:bg-amber-600 text-white border-transparent",
  outline: "bg-transparent border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white",
  ghost: "bg-transparent border-transparent hover:bg-gray-800 text-gray-400 hover:text-white",
  success: "bg-green-600 hover:bg-green-700 text-white border-transparent",
};

const sizes = {
  xs: "text-xs px-2.5 py-1.5",
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
  xl: "text-lg px-6 py-3",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  icon: Icon,
  iconPosition = "left",
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-lg border-2 transition-all duration-150 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={16} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={16} />}
        </>
      )}
    </button>
  );
};

export default Button;