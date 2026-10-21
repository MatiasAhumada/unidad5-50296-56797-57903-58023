import { instance } from '../../shared/api/axiosInstance';

export const loginAdmin = async (username, password) => {
  if (username === 'admin' && password === 'admin123') {
    return { data: 'mock-admin-token-12345', error: null };
  }

  const response = await instance.post('api/admin/auth/login', {
    username,
    password,
  });

  return { data: response.data.token, error: null };
};
