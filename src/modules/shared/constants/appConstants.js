const STORAGE_KEYS = {
  token: 'token',
  role: 'role',
};

const USER_ROLES = {
  administrator: 'ADMINISTRADOR',
  patient: 'PACIENTE',
};

const ROUTES = {
  home: '/',
  patientLogin: '/login',
  patientAppointments: '/appointments',
  admin: '/admin',
  adminLogin: '/admin/login',
  accessDenied: '/acceso-denegado',
  adminHome: '/admin/home',
  adminPatients: '/admin/patients',
  adminPatientSearch: '/admin/patient-search',
  adminAppointments: '/admin/appointments',
  adminSpecialties: '/admin/specialties',
  adminSpecialtyCreate: '/admin/specialties/new',
  adminDoctors: '/admin/doctors',
  adminDoctorCreate: '/admin/doctors/new',
  adminDoctorAvailability: '/admin/doctors/availability',
};

export { ROUTES, STORAGE_KEYS, USER_ROLES };
