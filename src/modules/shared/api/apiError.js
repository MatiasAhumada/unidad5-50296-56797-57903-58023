import { API_ERROR_MESSAGES } from '../constants/apiErrorMessages';

function normalizeApiError(error) {
  const status = error.response?.status ?? null;
  const category = status ?? 'network';
  const responseData = error.response?.data ?? {};

  return {
    status,
    errorCode: responseData.errorCode ?? null,
    details: responseData.details ?? [],
    message:
      responseData.message ||
      API_ERROR_MESSAGES[category] ||
      API_ERROR_MESSAGES.unexpected,
    originalError: error,
  };
}

function getApiErrorMessage(error) {
  const normalizedError =
    error?.status !== undefined ? error : normalizeApiError(error ?? {});

  if (Array.isArray(normalizedError.details) && normalizedError.details.length > 0) {
    const detailMsgs = normalizedError.details
      .map((d) => d.issue || d.message || (typeof d === 'string' ? d : null))
      .filter(Boolean);
    if (detailMsgs.length > 0) {
      return detailMsgs.join('. ');
    }
  }

  if (error?.message && !error?.response && error?.status === undefined) {
    return error.message;
  }

  return normalizedError.message;
}

export { getApiErrorMessage, normalizeApiError };
