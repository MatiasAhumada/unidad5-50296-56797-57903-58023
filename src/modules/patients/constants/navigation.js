import { ROUTES } from '../../shared/constants/appConstants';

const PATIENT_NAVIGATION = [
  { label: 'Reservar turno', to: ROUTES.home, end: true },
  { label: 'Mis turnos', to: ROUTES.patientAppointments },
];

export { PATIENT_NAVIGATION };
