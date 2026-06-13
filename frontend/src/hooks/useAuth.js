import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  selectAuth,
  selectIsAdmin,
  selectIsAuthenticated,
  selectUser,
  setCredentials,
  logout as logoutAction,
} from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApi";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loginMutation, { isLoading }] = useLoginMutation();

  const login = async (email, password) => {
    try {
      const result = await loginMutation({ email, password }).unwrap();
      dispatch(setCredentials(result.data));
      toast.success("Login successful! Welcome back.");
      navigate("/admin/dashboard");
      return { success: true };
    } catch (error) {
      const message = error?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return {
    user,
    isAdmin,
    isAuthenticated,
    loading: isLoading || auth.loading,
    login,
    logout,
  };
};

export default useAuth;