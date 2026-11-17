const DOCTORS_API_ROUTES = {
  list: '/api/doctors',
  create: '/api/doctors',
  update: (id) => `/api/doctors/${id}`,
  delete: (id) => `/api/doctors/${id}`,
  status: (id) => `/api/doctors/${id}/status`,
  optionsBySpecialty: (specialtyId) =>
    `/api/doctors/by-specialty/${specialtyId}/options`,
  availableSlots: (doctorId) => `/api/doctors/${doctorId}/available-slots`,
};

export { DOCTORS_API_ROUTES };
