import { URL_BACKEND } from '@/variables';
import { useQuery } from "react-query";
import axios from 'axios';

interface DashboardStats {
  activePeriodEnrollmentCount: number;
  activePeriodProfessorCount: number;
  activePeriodName?: string; // Optional, but good to have
  error?: string; // To handle backend errors gracefully
}

const fetchDashboardStats = async (JWT: string | null): Promise<DashboardStats> => {
  const response = await axios.get(`${URL_BACKEND}dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  return response.data.data;
};

export const useDashboardStats = (JWT: string | null) => {
  return useQuery(['dashboardStats'], () => fetchDashboardStats(JWT), {
    enabled: !!JWT,
  });
}