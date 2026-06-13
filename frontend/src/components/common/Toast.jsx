import React from "react";
import toast from "react-hot-toast";
import {
  MdCheckCircle,
  MdError,
  MdInfo,
  MdWarning,
} from "react-icons/md";

export const showToast = {
  success: (message) =>
    toast.success(message, {
      icon: <MdCheckCircle className="text-green-400" size={20} />,
    }),
  error: (message) =>
    toast.error(message, {
      icon: <MdError className="text-red-400" size={20} />,
    }),
  info: (message) =>
    toast(message, {
      icon: <MdInfo className="text-blue-400" size={20} />,
    }),
  warning: (message) =>
    toast(message, {
      icon: <MdWarning className="text-amber-400" size={20} />,
    }),
  wicket: (playerName) =>
    toast(`🏏 WICKET! ${playerName} is OUT!`, {
      duration: 4000,
      style: {
        background: "#450a0a",
        color: "#fca5a5",
        border: "1px solid #991b1b",
        fontWeight: "bold",
      },
    }),
  boundary: (runs, playerName) =>
    toast(
      `${runs === 6 ? "🚀 SIX!" : "🏏 FOUR!"} ${playerName} hits ${runs === 6 ? "a massive six" : "a boundary"}!`,
      {
        duration: 3000,
        style: {
          background: runs === 6 ? "#1e1b4b" : "#1e3a5f",
          color: runs === 6 ? "#c4b5fd" : "#93c5fd",
          border: `1px solid ${runs === 6 ? "#7c3aed" : "#2563eb"}`,
          fontWeight: "bold",
        },
      }
    ),
};

export default showToast;