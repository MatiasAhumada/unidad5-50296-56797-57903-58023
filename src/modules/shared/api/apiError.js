import { API_ERROR_MESSAGES } from '../constants/apiErrorMessages';

function normalizeApiError(error) {
  if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
    return null;
  }

  const response = error?.response;
  const status = response?.status ?? null;
  const body =
    response?.data && typeof response.data === 'object' ? response.data : {};
  const details = Array.isArray(body.details) ? body.details : [];
  const detailMessage = details
    .map((detail) => {
      if (typeof detail === 'string') return detail;

      if (!detail || typeof detail !== 'object') return '';

      return detail.issue || detail.message || '';
    })
    .filter((issue) => issue && /\s|[.!?]/.test(issue))
    .map((issue) => issue.replace(/[.?!\s]+$/, ''))
    .join('. ');

  return {
    status,
    errorCode: body.errorCode ?? null,
    message:
      detailMessage ||
      body.message ||
      API_ERROR_MESSAGES[status ?? 'network'] ||
      API_ERROR_MESSAGES.unexpected,
    details,
  };
}

export { normalizeApiError };
