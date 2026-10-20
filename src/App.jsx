import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import AdminLayout from './modules/admin/components/AdminLayout';
import AdminDashboardPage from './modules/dashboard/pages/AdminDashboardPage';
import SpecialtiesPage from './modules/specialties/pages/SpecialtiesPage';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Outlet />
        </>
      ),
      children: [
        {
          path: '/',
          element: <>Listado de productos</>,
        },
        {
          path: '/cart',
          element: <>Carrito de compras</>,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/admin/home" replace /> },
        { path: 'home', element: <AdminDashboardPage /> },
        { path: 'specialties', element: <SpecialtiesPage /> },
        { path: 'products', element: <ListProductsPage /> },
        { path: 'products/create', element: <CreateProductPage /> },
        { path: 'orders', element: <ListOrdersPage /> },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
