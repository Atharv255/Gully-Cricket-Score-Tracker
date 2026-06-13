import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import clsx from "clsx";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closable = true,
  className = "",
}) => {
  const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && closable) onClose?.();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, closable]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={closable ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        className={clsx(
          "relative w-full bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl animate-bounce-in my-8 max-h-[90vh] flex flex-col",
          sizeMap[size],
          className
        )}
      >
        {/* Header - Fixed at top */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-gray-800 flex-shrink-0">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {closable && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
              >
                <MdClose size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;