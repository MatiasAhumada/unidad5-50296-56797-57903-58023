const DOCTORS_API_ROUTES = {
  list: '/api/doctors',
  create: '/api/doctors',
  update: (id) => `/api/doctors/${id}`,
  delete: (id) => `/api/doctors/${id}`,
  availabilities: (id) => `/api/doctors/${id}/availabilities`,
  saveAvailability: '/api/availabilities',
  optionsBySpecialty: (specialtyId) =>
    `/api/doctors/by-specialty/${specialtyId}/options`,
  availableSlots: (doctorId) => `/api/doctors/${doctorId}/available-slots`,
};

export { DOCTORS_API_ROUTES };