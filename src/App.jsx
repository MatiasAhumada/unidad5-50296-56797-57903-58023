import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import PatientLoginPage from './modules/patients/pages/PatientLoginPage';
import AdminLoginPage from './modules/admin/pages/AdminLoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import Home from './modules/home/pages/Home';
import PatientsAdmin from './modules/admin/pages/PatientsAdmin';
import AppointmentsAdmin from './modules/admin/pages/AppointmentsAdmin';
import DoctorsAdmin from './modules/admin/pages/DoctorsAdmin';
import PatientLayout from './modules/patients/components/PatientLayout';
import PatientHome from './modules/patients/pages/PatientHome';
import AppointmentsPage from './modules/patients/pages/AppointmentsPage';

const routes = [
  // Rutas públicas
  {
    path: '/login',
    element: <PatientLoginPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // Rutas privadas de pacientes (URL base y turnos)
  {
    path: '/',
    element: (
      <ProtectedRoute redirectTo="/login">
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PatientHome />,
      },
      {
        path: 'appointments',
        element: <AppointmentsPage />,
      },
    ],
  },

  // Rutas privadas de administración del centro médico
  {
    path: '/admin',
    element: (
      <ProtectedRoute redirectTo="/admin/login">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/home" replace />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'patients',
        element: <PatientsAdmin />,
      },
      {
        path: 'appointments',
        element: <AppointmentsAdmin />,
      },
      {
        path: 'doctors',
        element: <DoctorsAdmin />,
      },
    ],
  },

  // Redirección para cualquier otra URL
  {
    path: '*',
    element: <Navigate to="/" replace />,
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
