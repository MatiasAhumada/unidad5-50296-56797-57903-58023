import { instance } from '../../shared/api/axiosInstance';
import { DASHBOARD_API_ROUTES } from '../constants/apiRoutes';

async function getDashboardSummary(date, signal) {
  const response = await instance.get(DASHBOARD_API_ROUTES.summary, {
    params: { date },
    signal,
  });

  return response.data;
}

export { getDashboardSummary };
