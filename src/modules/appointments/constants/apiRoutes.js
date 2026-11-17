const APPOINTMENTS_API_ROUTES = {
  list: '/api/appointments',
  search: '/api/appointments/search',
  listForPatient: '/api/appointments/patient',
  create: '/api/appointments',
  cancel: (appointmentId) => `/api/appointments/${appointmentId}`,
};

export { APPOINTMENTS_API_ROUTES };
