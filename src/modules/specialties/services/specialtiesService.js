import { normalizeApiError } from '../../shared/api/apiError';
import { normalizePageIndex } from '../../shared/api/pagination';
import { instance } from '../../shared/api/axiosInstance';
import { SPECIALTIES_API_ROUTES } from '../constants/apiRoutes';

async function getSpecialtiesPage(
  { pageSize = 50, pageIndex = 1, name } = {},
  signal
) {
  try {
    const response = await instance.get(SPECIALTIES_API_ROUTES.list, {
      params: { pageSize, pageIndex, name, includeInactive: true },
      signal,
    });

    return {
      data: {
        ...response.data,
        pageIndex: normalizePageIndex(response.data.pageIndex, pageIndex),
      },
      error: null,
    };
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

async function createSpecialty(payload) {
  try {
    const response = await instance.post(
      SPECIALTIES_API_ROUTES.create,
      payload
    );

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function updateSpecialty(id, payload) {
  try {
    const response = await instance.put(
      SPECIALTIES_API_ROUTES.update(id),
      payload
    );

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

async function setSpecialtyStatus(id, isActive) {
  try {
    const response = await instance.put(SPECIALTIES_API_ROUTES.status(id), {
      isActive,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function getSpecialtyMetrics(signal) {
  try {
    const response = await instance.get(SPECIALTIES_API_ROUTES.metrics, {
      signal,
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
  getSpecialtyMetrics,
  setSpecialtyStatus,
  updateSpecialty,
};
