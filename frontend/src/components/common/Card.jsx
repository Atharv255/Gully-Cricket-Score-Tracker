import React from "react";
import clsx from "clsx";

const Card = ({
  children,
  className = "",
  title,
  subtitle,
  action,
  noPadding = false,
  dark = false,
}) => {
  return (
    <div
      className={clsx(
        "rounded-xl border shadow-lg",
        dark
          ? "bg-gray-950 border-gray-800"
          : "bg-gray-900 border-gray-800",
        !noPadding && "p-4",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-base font-bold text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;