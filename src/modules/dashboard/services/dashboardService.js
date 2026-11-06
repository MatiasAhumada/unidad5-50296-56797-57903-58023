import { instance } from '../../shared/api/axiosInstance';
import { DASHBOARD_API_ROUTES } from '../constants/apiRoutes';

async function getDashboardSummary(date, signal) {
  try {
    const response = await instance.get(DASHBOARD_API_ROUTES.summary, {
      params: { date },
      signal,
    });

    return response.data;
  } catch (error) {
    // Si la ruta específica no existe o falla por 404, calculamos los totales agregando las rutas base
    if (error?.status === 404 || error?.response?.status === 404) {
      const [doctorsRes, specialtiesRes, appointmentsRes] = await Promise.all([
        instance.get('/api/doctors', {
          params: { pageSize: 1, pageIndex: 1 },
          signal,
        }),
        instance.get('/api/specialties', {
          params: { pageSize: 1, pageIndex: 1 },
          signal,
        }),
        instance.get('/api/appointments/search', {
          params: { pageSize: 1, pageIndex: 1, date, status: 'BOOKED' },
          signal,
        }),
      ]);

      return {
        activeDoctors: doctorsRes.data?.total ?? 0,
        activeSpecialities: specialtiesRes.data?.total ?? 0,
        confirmedAppointments: appointmentsRes.data?.total ?? 0,
      };
    }

    throw error;
  }
}

export { getDashboardSummary };