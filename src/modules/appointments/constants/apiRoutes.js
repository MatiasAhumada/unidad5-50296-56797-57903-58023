const APPOINTMENTS_API_ROUTES = {
  search: '/api/appointments/search',
  listForPatient: '/api/appointments/patient',
  create: '/api/appointments',
  cancel: (appointmentId) => `/api/appointments/${appointmentId}`,
  attendance: (appointmentId) =>
    `/api/appointments/${appointmentId}/attendance`,
};

export { APPOINTMENTS_API_ROUTES };
