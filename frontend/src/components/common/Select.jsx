import React from "react";
import clsx from "clsx";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={clsx(
          "input-field appearance-none cursor-pointer",
          error && "border-red-500 focus:border-red-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-xs mt-1">⚠ {error}</p>
      )}
    </div>
  );
};

export default Select;