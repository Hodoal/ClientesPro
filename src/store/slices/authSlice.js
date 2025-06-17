import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth'; // Assumes authService is correctly refactored

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => { // credentials = { email, password }
    try {
      const { user, token } = await authService.login(credentials.email, credentials.password);
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => { // userData = { username, email, password, (optional: mobile) }
    try {
      const { user, token } = await authService.register(userData);
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => { // Added dispatch here
    try {
      await authService.logout();
      // Dispatch logoutSuccess directly from here to ensure state clears,
      // as thunk lifecycle for fulfilled might not be exactly what we want if logout itself has no payload.
      dispatch(authSlice.actions.logoutSuccess());
      return true;
    } catch (error) {
      // Even if backend logout fails, clear client state.
      dispatch(authSlice.actions.logoutSuccess());
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const session = await authService.getCurrentUser();
      if (session && session.token && session.user) {
        const verifiedUser = await authService.verifyToken(); // Calls GET /api/auth/me
        if (verifiedUser) {
          return { user: verifiedUser, token: session.token };
        } else {
          // authService.verifyToken() calls logout if token is invalid
          // No need to dispatch logoutSuccess here as verifyToken handles it by calling authService.logout()
          // which should then be reflected in UI if app listens to storage changes or re-checks auth state.
          // However, to be explicit for Redux state on app load:
          // dispatch(authSlice.actions.logoutSuccess()); // This was causing an issue.
          return rejectWithValue('Session expired or token invalid.');
        }
      }
      return rejectWithValue('No active session found.');
    } catch (error) {
      console.error("checkAuthState error in thunk:", error);
      // dispatch(authSlice.actions.logoutSuccess()); // Avoid dispatching here if error is not auth related
      return rejectWithValue(error.message || 'Failed to check auth state.');
    }
  }
);


const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  appLoading: true, // True initially, set to false after checkAuthState completes
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logoutSuccess: (state) => { // Centralized logout logic for state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.appLoading = false; // Ensure app is not stuck in loading after logout
      state.error = null;
    },
    setAppLoading: (state, action) => {
        state.appLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true; state.error = null; state.appLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user; state.token = action.payload.token;
        state.isAuthenticated = true; state.loading = false; state.appLoading = false; state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload; state.isAuthenticated = false; state.user = null; state.token = null;
        state.loading = false; state.appLoading = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true; state.error = null; state.appLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user; state.token = action.payload.token;
        state.isAuthenticated = true; state.loading = false; state.appLoading = false; state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload; state.isAuthenticated = false; state.user = null; state.token = null;
        state.loading = false; state.appLoading = false;
      })
      // Logout (Thunk itself dispatches logoutSuccess)
      .addCase(logoutUser.pending, (state) => { state.loading = true; })
      // .addCase(logoutUser.fulfilled, (state) => { /* Handled by dispatch in thunk */ })
      .addCase(logoutUser.rejected, (state, action) => { // If thunk itself fails before dispatching logoutSuccess
        state.error = action.payload; state.loading = false; state.appLoading = false;
        // State is already cleared by dispatch in thunk's catch block.
      })
      // Check Auth State
      .addCase(checkAuthState.pending, (state) => {
        state.appLoading = true; state.error = null;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload.user; state.token = action.payload.token;
        state.isAuthenticated = true; state.appLoading = false; state.error = null;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        // This means no valid session found or token verification failed.
        // authService.verifyToken() would have called authService.logout() which clears AsyncStorage.
        // So, ensure Redux state reflects this logged-out status.
        state.user = null; state.token = null; state.isAuthenticated = false;
        state.appLoading = false;
        // state.error = action.payload; // Optional: set error for debugging, but usually not shown to user
        console.log("checkAuthState rejected, state updated to logged out:", action.payload);
      });
  },
});

export const { clearError, logoutSuccess, setAppLoading } = authSlice.actions;
export default authSlice.reducer;
