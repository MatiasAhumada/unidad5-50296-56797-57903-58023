import { instance } from '../../shared/api/axiosInstance';
import { SPECIALTIES_API_ROUTES } from '../constants/apiRoutes';

async function getSpecialties(signal) {
  const pageSize = 50;
  const specialties = [];
  let pageIndex = 1;
  let total = Number.POSITIVE_INFINITY;

  while (specialties.length < total) {
    const response = await instance.get(SPECIALTIES_API_ROUTES.list, {
      params: { pageSize, pageIndex },
      signal,
    });
    const page = response.data;

    specialties.push(...page.data);
    total = page.total;

    if (page.data.length === 0) {
      break;
    }

    pageIndex += 1;
  }

  return specialties;
}

export { getSpecialties };
