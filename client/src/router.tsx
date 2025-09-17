import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import App from './App';
import { AuthPage } from './features/auth/routes/AuthPage';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { LobbyPage } from './features/lobby/routes/LobbyPage';
import { GamePage } from './features/game/routes/GamePage';
import { loginLoader } from './features/auth/loaders';
import { loginAction, registerAction, logoutAction } from './features/auth/actions';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { lobbyLoader } from './features/lobby/loaders';
import { gameLoader } from './features/game/loaders';

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
          { 
            path: 'login', 
            element: <LoginForm />,
            loader: loginLoader,
            action: loginAction
          },
          { 
            path: 'register', 
            element: <RegisterForm />,
            action: registerAction
           },
           {
            path: 'logout',
            action: logoutAction
           }
        ],
      },
      {
        path: 'lobby',
        element: (
          <ProtectedRoute>
            <LobbyPage />
          </ProtectedRoute>
        ),
        loader: lobbyLoader
      },
      {
        path: 'game/:gameId',
        element: (
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        ),
        loader: gameLoader
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