import { instance } from '../../shared/api/axiosInstance';
import { SPECIALTIES_API_ROUTES } from '../constants/apiRoutes';

async function getSpecialtiesPage(
  { pageSize = 50, pageIndex = 1, name } = {},
  signal
) {
  const response = await instance.get(SPECIALTIES_API_ROUTES.list, {
    params: { pageSize, pageIndex, name },
    signal,
  });

  return response.data;
}

async function getSpecialties(signal) {
  const pageSize = 100;
  const specialties = [];
  let pageIndex = 1;
  let total = Number.POSITIVE_INFINITY;

  while (specialties.length < total) {
    const page = await getSpecialtiesPage({ pageSize, pageIndex }, signal);

    specialties.push(...page.data);
    total = page.total;

    if (page.data.length === 0) {
      break;
    }

    pageIndex += 1;
  }

  return specialties;
}

export { getSpecialties, getSpecialtiesPage };
