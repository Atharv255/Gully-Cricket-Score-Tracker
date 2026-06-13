import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://gully-cricket-score-tracker.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds (Render free tier may take time to wake up)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong";

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/admin/login";
      }
    }

    if (error.response?.status === 403) {
      toast.error("Access denied. Admin privileges required.");
    }

    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again.");
    }

    // Handle timeout (Render free tier cold start)
    if (error.code === "ECONNABORTED") {
      toast.error(
        "Server is waking up. Please try again in 30 seconds.",
        { duration: 5000 }
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;