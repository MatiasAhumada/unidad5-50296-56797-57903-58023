const SPECIALTIES_API_ROUTES = {
  list: '/api/specialties',
  create: '/api/specialties',
  update: (id) => `/api/specialties/${id}`,
  delete: (id) => `/api/specialties/${id}`,
};

export { SPECIALTIES_API_ROUTES };
