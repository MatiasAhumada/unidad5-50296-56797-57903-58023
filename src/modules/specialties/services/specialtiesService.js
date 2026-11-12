import { normalizeApiError } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { SPECIALTIES_API_ROUTES } from '../constants/apiRoutes';

async function getSpecialtiesPage(
  { pageSize = 50, pageIndex = 1, name, includeInactive } = {},
  signal
) {
  try {
    const response = await instance.get(SPECIALTIES_API_ROUTES.list, {
      params: { pageSize, pageIndex, name, includeInactive },
      signal,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function getSpecialties(signal, includeInactive = false) {
  try {
    const pageSize = 100;
    const specialties = [];
    let pageIndex = 1;
    let total = Infinity;

    while (specialties.length < total) {
      const response = await instance.get(SPECIALTIES_API_ROUTES.list, {
        params: { pageSize, pageIndex, includeInactive },
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

async function createSpecialty({ name, description }) {
  try {
    const response = await instance.post(SPECIALTIES_API_ROUTES.create, {
      name,
      description,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function updateSpecialty(id, { name, description }) {
  try {
    const response = await instance.put(SPECIALTIES_API_ROUTES.update(id), {
      name,
      description,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function deleteSpecialty(id) {
  try {
    const response = await instance.delete(SPECIALTIES_API_ROUTES.delete(id));

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function toggleSpecialtyStatus(id, isActive) {
  try {
    const response = await instance.put(SPECIALTIES_API_ROUTES.status(id), {
      isActive,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

export {
  createSpecialty,
  deleteSpecialty,
  getSpecialties,
  getSpecialtiesPage,
  toggleSpecialtyStatus,
  updateSpecialty,
};
