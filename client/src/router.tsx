import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import App from './App';
import { AuthPage } from './features/auth/routes/AuthPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth" replace />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}