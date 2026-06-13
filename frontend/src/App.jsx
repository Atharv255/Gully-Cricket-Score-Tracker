import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { checkAuth } from "./features/auth/authSlice";
import useDarkMode from "./hooks/useDarkMode";

const App = () => {
  const dispatch = useDispatch();
  
  // Initialize dark mode on app load
  useDarkMode();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <AppRoutes />
    </div>
  );
};

export default App;