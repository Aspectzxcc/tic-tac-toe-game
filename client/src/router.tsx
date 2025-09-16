import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import App from './App';
import { AuthPage } from './features/auth/routes/AuthPage';
import { LobbyPage } from './features/lobby/routes/LobbyPage';

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
      {
        path: 'lobby',
        element: <LobbyPage />,
      }
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}