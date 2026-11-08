import { instance } from '../../shared/api/axiosInstance';
import { SPECIALTIES_API_ROUTES } from '../constants/apiRoutes';

async function getSpecialtiesPage(
  { pageSize = 50, pageIndex = 1, name, includeInactive } = {},
  signal
) {
  const response = await instance.get(SPECIALTIES_API_ROUTES.list, {
    params: { pageSize, pageIndex, name, includeInactive },
    signal,
  });

  return response.data;
}

async function getSpecialties(signal, includeInactive = false) {
  const pageSize = 100;
  const specialties = [];
  let pageIndex = 1;
  let total = Number.POSITIVE_INFINITY;

  while (specialties.length < total) {
    const page = await getSpecialtiesPage(
      { pageSize, pageIndex, includeInactive },
      signal
    );

    specialties.push(...page.data);
    total = page.total;

    if (page.data.length === 0) {
      break;
    }

    pageIndex += 1;
  }

  return specialties;
}

async function createSpecialty({ name, description }) {
  const response = await instance.post(SPECIALTIES_API_ROUTES.create, {
    name,
    description,
  });

  return response.data;
}

async function updateSpecialty(id, { name, description }) {
  const response = await instance.put(SPECIALTIES_API_ROUTES.update(id), {
    name,
    description,
  });

  return response.data;
}

async function deleteSpecialty(id) {
  const response = await instance.delete(SPECIALTIES_API_ROUTES.delete(id));

  return response.data;
}

async function toggleSpecialtyStatus(id, isActive) {
  const response = await instance.put(SPECIALTIES_API_ROUTES.status(id), {
    isActive,
  });

  return response.data;
}

export {
  createSpecialty,
  deleteSpecialty,
  getSpecialties,
  getSpecialtiesPage,
  toggleSpecialtyStatus,
  updateSpecialty,
};
