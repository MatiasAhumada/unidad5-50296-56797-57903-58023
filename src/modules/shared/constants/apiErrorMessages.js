const API_ERROR_MESSAGES = {
  network:
    'No se pudo conectar con el servidor. Revisá tu conexión e intentá nuevamente.',
  400: 'Los datos enviados no son válidos. Revisalos e intentá nuevamente.',
  401: 'La sesión no es válida o venció. Iniciá sesión nuevamente.',
  403: 'No tenés permisos para realizar esta acción.',
  409: 'La operación entra en conflicto con el estado actual. Actualizá los datos e intentá nuevamente.',
  429: 'Se alcanzó el límite de solicitudes. Esperá un momento antes de volver a intentar.',
  500: 'Ocurrió un error en el servidor. Intentá nuevamente más tarde.',
  unexpected: 'Ocurrió un error inesperado. Intentá nuevamente.',
};

export { API_ERROR_MESSAGES };
