import { instance } from '../../shared/api/axiosInstance';
import { AUTH_API_ROUTES } from '../constants/apiRoutes';

export const loginAdmin = async (email, password) => {
  const response = await instance.post(
    AUTH_API_ROUTES.adminLogin,
    {
      email,
      password,
    },
    { skipAuthRedirect: true }
  );

  return { data: response.data, error: null };
};
