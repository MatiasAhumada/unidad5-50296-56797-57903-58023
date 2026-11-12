import { API_ERROR_MESSAGES } from '../constants/apiErrorMessages';

function getErrorDetailsMessage(details) {
  if (!Array.isArray(details)) return '';

  return details
    .map((detail) => {
      if (typeof detail === 'string') return detail;
      if (!detail || typeof detail !== 'object') return '';
      return detail.issue || detail.message || '';
    })
    .filter(Boolean)
    .join('. ');
}

function normalizeApiError(error) {
  const response = error?.response;
  const status = response?.status ?? null;
  const body = response?.data && typeof response.data === 'object'
    ? response.data
    : {};
  const details = Array.isArray(body.details) ? body.details : [];
  const message = getErrorDetailsMessage(details) || body.message ||
    API_ERROR_MESSAGES[status ?? 'network'] || API_ERROR_MESSAGES.unexpected;

  return {
    status,
    errorCode: typeof body.errorCode === 'string' ? body.errorCode : null,
    details,
    message,
  };
}

function getApiErrorMessage(error) {
  return error?.message || normalizeApiError(error).message;
}

async function withApiResult(request) {
  try {
    return { data: await request(), error: null };
  } catch (error) {
    if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
      return { data: null, error: null };
    }

    return { data: null, error: normalizeApiError(error) };
  }
}

export { getApiErrorMessage, normalizeApiError, withApiResult };
