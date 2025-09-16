import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Suspense } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
    ],
  },
]);

export const AppRouter = () => {
  <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
}