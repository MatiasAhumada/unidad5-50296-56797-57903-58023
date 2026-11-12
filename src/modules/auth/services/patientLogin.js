import { withApiResult } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { AUTH_API_ROUTES } from '../constants/apiRoutes';

export const loginPatient = async (email, dni) =>
  withApiResult(async () => {
    const response = await instance.post(
      AUTH_API_ROUTES.patientLogin,
      { email, dni: Number(dni) },
      { skipAuthRedirect: true }
    );

    return response.data;
  });
