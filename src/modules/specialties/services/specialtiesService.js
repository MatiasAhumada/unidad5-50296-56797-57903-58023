import { normalizeApiError } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { SPECIALTIES_API_ROUTES } from '../constants/apiRoutes';

async function getSpecialtiesPage(
  { pageSize = 50, pageIndex = 1, name } = {},
  signal
) {
  try {
    const response = await instance.get(SPECIALTIES_API_ROUTES.list, {
      params: { pageSize, pageIndex, name },
      signal,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function getSpecialties(signal) {
  try {
    const pageSize = 100;
    const specialties = [];
    let pageIndex = 1;
    let total = Infinity;

    while (specialties.length < total) {
      const response = await instance.get(SPECIALTIES_API_ROUTES.list, {
        params: { pageSize, pageIndex },
        signal,
      });
      const page = response.data;

      specialties.push(...page.data);
      total = page.total;

      if (page.data.length === 0) break;

      pageIndex += 1;
    }

    return { data: specialties, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

export { getSpecialties, getSpecialtiesPage };
