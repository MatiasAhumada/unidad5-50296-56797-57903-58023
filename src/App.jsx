import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import AccessDeniedPage from './modules/auth/pages/AccessDeniedPage';

// Auth Module
import AdminLoginPage from './modules/auth/pages/AdminLoginPage';

// Patients Module
import PatientLoginPage from './modules/patients/pages/PatientLoginPage';
import PatientLayout from './modules/patients/components/PatientLayout';
import PatientHome from './modules/patients/pages/PatientHome';
import AppointmentsPage from './modules/patients/pages/AppointmentsPage';

// Dashboard Module
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import OverviewPage from './modules/dashboard/pages/OverviewPage';

// Domain Modules (Screaming Architecture)
import DoctorsPage from './modules/doctors/pages/DoctorsPage';
import DoctorFormPage from './modules/doctors/pages/DoctorFormPage';
import DoctorAvailabilityPage from './modules/doctors/pages/DoctorAvailabilityPage';
import SpecialtiesPage from './modules/specialties/pages/SpecialtiesPage';
import SpecialtyFormPage from './modules/specialties/pages/SpecialtyFormPage';
import AppointmentsSearchPage from './modules/appointments/pages/AppointmentsSearchPage';
import { ROUTES, USER_ROLES } from './modules/shared/constants/appConstants';

const routes = [
  // Rutas públicas
  {
    path: ROUTES.patientLogin,
    element: <PatientLoginPage />,
  },
  {
    path: ROUTES.adminLogin,
    element: <AdminLoginPage />,
  },
  {
    path: ROUTES.accessDenied,
    element: <AccessDeniedPage />,
  },

  // Rutas privadas de pacientes (URL base y turnos)
  {
    path: ROUTES.home,
    element: (
      <ProtectedRoute
        allowedRole={USER_ROLES.patient}
        redirectTo={ROUTES.patientLogin}
      >
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PatientHome />,
      },
      {
        path: ROUTES.patientAppointments,
        element: <AppointmentsPage />,
      },
    ],
  },

  // Rutas privadas de gestión clínica y administración
  {
    path: ROUTES.admin,
    element: (
      <ProtectedRoute
        allowedRole={USER_ROLES.administrator}
        redirectTo={ROUTES.adminLogin}
      >
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.adminHome} replace />,
      },
      {
        path: ROUTES.adminHome,
        element: <OverviewPage />,
      },
      {
        path: ROUTES.adminPatients,
        element: <AppointmentsSearchPage />,
      },
      {
        path: ROUTES.adminPatientSearch,
        element: <AppointmentsSearchPage />,
      },
      {
        path: ROUTES.adminAppointments,
        element: <Navigate to={ROUTES.adminPatients} replace />,
      },
      {
        path: ROUTES.adminSpecialties,
        element: <SpecialtiesPage />,
      },
      {
        path: ROUTES.adminSpecialtyCreate,
        element: <SpecialtyFormPage />,
      },
      {
        path: ROUTES.adminDoctors,
        element: <DoctorsPage />,
      },
      {
        path: ROUTES.adminDoctorCreate,
        element: <DoctorFormPage />,
      },
      {
        path: ROUTES.adminDoctorAvailability,
        element: <DoctorAvailabilityPage />,
      },
    ],
  },

  // Redirección para cualquier otra URL
  {
    path: '*',
    element: <Navigate to={ROUTES.home} replace />,
  },
];

function App() {
  const router = createBrowserRouter(routes);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
