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
  if (error?.message && !error?.response && error?.status === undefined) {
    return error.message;
  }

  const normalizedError =
    error?.status !== undefined ? error : normalizeApiError(error ?? {});

  return normalizedError.message;
}

export { getApiErrorMessage, normalizeApiError };
