const DOCTORS_API_ROUTES = {
  optionsBySpecialty: (specialtyId) =>
    `/api/specialties/${specialtyId}/doctors/options`,
  availabilities: (doctorId) => `/api/doctors/${doctorId}/availabilities`,
};

export { DOCTORS_API_ROUTES };
