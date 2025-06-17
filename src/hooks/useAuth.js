import { useSelector, useDispatch } from 'react-redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthState,
  clearError as clearAuthErrorAction, // Renamed to avoid conflict if hook exposes its own clearError
  setAppLoading as setAuthAppLoadingAction,
  logoutSuccess // Import if needed for direct dispatch, though logoutUser thunk handles it
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  // Selectors for auth state
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.loading); // For login/register loading
  const isAppLoading = useSelector((state) => state.auth.appLoading); // For initial auth check loading
  const error = useSelector((state) => state.auth.error);

  // Exposed actions, wrapping dispatch
  const login = (credentials) => { // credentials: { email, password }
    return dispatch(loginUser(credentials)); // Thunk returns a promise which can be awaited in component
  };

  const register = (userData) => { // userData: { username, email, password, mobile? }
    return dispatch(registerUser(userData));
  };

  const logout = () => {
    // The logoutUser thunk now dispatches logoutSuccess itself.
    return dispatch(logoutUser());
  };

  const checkAuthStatus = () => {
    // This is typically called once when the app initializes
    return dispatch(checkAuthState());
  };

  const clearError = () => {
    dispatch(clearAuthErrorAction());
  };

  const setAppLoading = (isLoading) => { // Manually control appLoading if needed outside of checkAuthState
    dispatch(setAuthAppLoadingAction(isLoading));
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAppLoading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    clearError,
    setAppLoading,
  };
};
