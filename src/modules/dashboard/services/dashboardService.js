import { normalizeApiError } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { DASHBOARD_API_ROUTES } from '../constants/apiRoutes';
import { DOCTORS_API_ROUTES } from '../../doctors/constants/apiRoutes';
import { SPECIALTIES_API_ROUTES } from '../../specialties/constants/apiRoutes';
import { APPOINTMENTS_API_ROUTES } from '../../appointments/constants/apiRoutes';

async function getDashboardSummary(date, signal) {
  try {
    const response = await instance.get(DASHBOARD_API_ROUTES.summary, {
      params: { date },
      signal,
    });

    return { data: response.data, error: null };
  } catch (error) {
    if (error.response?.status !== 404) {
      return { data: null, error: normalizeApiError(error) };
    }

    try {
      const [doctors, specialties, appointments] = await Promise.all([
        instance.get(DOCTORS_API_ROUTES.list, {
          params: { pageSize: 1, pageIndex: 1 },
          signal,
        }),
        instance.get(SPECIALTIES_API_ROUTES.list, {
          params: { pageSize: 1, pageIndex: 1 },
          signal,
        }),
        instance.get(APPOINTMENTS_API_ROUTES.search, {
          params: { pageSize: 1, pageIndex: 1, date, status: 'BOOKED' },
          signal,
        }),
      ]);

      return {
        data: {
          activeDoctors: doctors.data?.total ?? 0,
          activeSpecialities: specialties.data?.total ?? 0,
          confirmedAppointments: appointments.data?.total ?? 0,
        },
        error: null,
      };
    } catch (fallbackError) {
      return { data: null, error: normalizeApiError(fallbackError) };
    }
  }
}

export { getDashboardSummary };
