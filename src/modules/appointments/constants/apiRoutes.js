const APPOINTMENTS_API_ROUTES = {
  listForPatient: '/api/appointments/patient',
  create: '/api/appointments',
  cancel: (appointmentId) => `/api/appointments/${appointmentId}`,
};

export { APPOINTMENTS_API_ROUTES };
