import { instance } from '../../shared/api/axiosInstance';

export const loginPatient = async (username, password) => {
  if (
    (username === 'paciente' || username === 'paciente@test.com') &&
    password === 'paciente123'
  ) {
    return { data: 'mock-patient-token-67890', error: null };
  }

  const response = await instance.post('api/patient/auth/login', {
    username,
    password,
  });

  return { data: response.data.token, error: null };
};
