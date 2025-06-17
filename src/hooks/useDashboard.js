import { useSelector, useDispatch } from "react-redux";
import {
  setDashboardData,
  setDashboardLoading,
  setDashboardError,
  clearDashboardError,
} from "../store/slices/dashboardSlice";

const useDashboard = () => {
  const dispatch = useDispatch();

  const { data, isLoading, error } = useSelector((state) => state.dashboard);

  // Action dispatchers
  const loadDashboardData = (payload) => {
    // In a real app, this might dispatch an async thunk
    // For now, it directly uses setDashboardData
    dispatch(setDashboardData(payload));
  };

  const setLoadingState = (loadingState) => {
    dispatch(setDashboardLoading(loadingState));
  };

  const setErrorState = (errorState) => {
    dispatch(setDashboardError(errorState));
  };

  const clearErrorState = () => {
    dispatch(clearDashboardError());
  };

  return {
    data,
    isLoading,
    error,
    loadDashboardData,
    setLoadingState,
    setErrorState,
    clearErrorState,
  };
};

export default useDashboard;
