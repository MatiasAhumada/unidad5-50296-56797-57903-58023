const DOCTORS_API_ROUTES = {
  optionsBySpecialty: (specialtyId) =>
    `/api/doctors/by-specialty/${specialtyId}/options`,
  availableSlots: (doctorId) => `/api/doctors/${doctorId}/available-slots`,
};

export { DOCTORS_API_ROUTES };
