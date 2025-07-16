import { useDispatch, useSelector } from "react-redux";
import { use, useCallback, useEffect } from "react";
import {
  dashboardPayment,
  dashboardRevenue,
  dashboardSumary,
} from "../Feartures/dashboard/dashboardSlice";

const useDashboard = () => {
  const dispatch = useDispatch();
  const { dashboards, revenues, summary, loading, error, total } = useSelector(
    (state) => state.dashboard
  );

  const listDashboardPayment = useCallback(
    (searchPayload) => {
      dispatch(dashboardPayment(searchPayload));
    },
    [dispatch]
  );

  //   Revenues
  const listDashboardRevenues = useCallback(
    (searchPayload) => {
      dispatch(dashboardRevenue(searchPayload));
    },
    [dispatch]
  );

  //   Sumary
  const listDashboardSumary = useCallback(
    (searchPayload) => {
      dispatch(dashboardSumary(searchPayload));
    },
    [dispatch]
  );

  return {
    dashboards,
    revenues,
    summary,
    loading,
    error,
    total,
    listDashboardPayment,
    listDashboardRevenues,
    listDashboardSumary,
  };
};

export default useDashboard;
