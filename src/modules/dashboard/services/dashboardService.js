import { normalizeApiError } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { DASHBOARD_API_ROUTES } from '../constants/apiRoutes';

async function getDashboardSummary(date, signal) {
  try {
    const response = await instance.get(DASHBOARD_API_ROUTES.summary, {
      params: { date },
      signal,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

export { getDashboardSummary };
