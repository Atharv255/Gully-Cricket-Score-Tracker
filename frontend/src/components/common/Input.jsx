import React from "react";
import clsx from "clsx";

const Input = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = "",
  hint = "",
  icon: Icon,
  min,
  max,
  step,
  autoComplete,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon size={16} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          className={clsx(
            "input-field",
            Icon && "pl-9",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-gray-500 text-xs mt-1">{hint}</p>
      )}
    </div>
  );
};

export default Input;