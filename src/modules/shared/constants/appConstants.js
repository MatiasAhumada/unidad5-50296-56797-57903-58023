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
  adminHome: '/admin/home',
  adminPatients: '/admin/patients',
  adminPatientSearch: '/admin/patient-search',
  adminAppointments: '/admin/appointments',
  adminSpecialties: '/admin/specialties',
  adminDoctors: '/admin/doctors',
};

export { ROUTES, STORAGE_KEYS, USER_ROLES };
