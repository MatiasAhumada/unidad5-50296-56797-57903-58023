const ERROR_MESSAGES = {
  network:
    'No se pudo conectar con el servidor. Revisá tu conexión e intentá nuevamente.',
  400: 'Los datos enviados no son válidos. Revisalos e intentá nuevamente.',
  401: 'La sesión no es válida o venció. Iniciá sesión nuevamente.',
  403: 'No tenés permisos para realizar esta acción.',
  409: 'La operación entra en conflicto con el estado actual. Actualizá los datos e intentá nuevamente.',
  429: 'Se alcanzó el límite de solicitudes. Esperá un momento antes de volver a intentar.',
  500: 'Ocurrió un error en el servidor. Intentá nuevamente más tarde.',
};

function normalizeApiError(error) {
  const status = error.response?.status ?? null;
  const category = status ?? 'network';
  const responseData = error.response?.data ?? {};

  return {
    status,
    errorCode: responseData.errorCode ?? null,
    details: responseData.details ?? [],
    message:
      ERROR_MESSAGES[category] ??
      'Ocurrió un error inesperado. Intentá nuevamente.',
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
