import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  logoutUser,
  registerUser,
  clearAuth,
  clearError,
} from "../store/slices/authSlice"; // Assuming authSlice.js exports these actions

// It might also be useful to have selectors here or directly in the component
// For simplicity, we will select directly in the hook for now.

const useAuth = () => {
  const dispatch = useDispatch();

  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Memoizing action dispatchers can be an optimization,
  // but for simplicity in this step, we define them directly.
  // For more complex scenarios or if performance becomes an issue,
  // consider useCallback.

  const login = (credentials) => {
    return dispatch(loginUser(credentials)); // loginUser is an async thunk
  };

  const register = (userData) => {
    return dispatch(registerUser(userData)); // registerUser is an async thunk
  };

  const logout = () => {
    return dispatch(logoutUser()); // logoutUser is an async thunk
  };

  const clearAuthentication = () => {
    dispatch(clearAuth());
  };

  const clearAuthenticationError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearAuthentication,
    clearAuthenticationError,
  };
};

export default useAuth;
