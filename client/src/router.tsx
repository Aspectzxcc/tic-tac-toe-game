import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import App from './App';
import { AuthPage } from './features/auth/routes/AuthPage';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { LobbyPage } from './features/lobby/routes/LobbyPage';
import { GamePage } from './features/game/routes/GamePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          { path: 'login', element: <LoginForm /> },
          { path: 'register', element: <RegisterForm /> },
        ],
      },
      {
        path: 'lobby',
        element: <LobbyPage />,
      },
      {
        path: 'game', // to be changed with game/:gameId
        element: <GamePage />,
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