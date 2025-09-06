import { createBrowserRouter, redirect, RouterProvider } from 'react-router';
import { ROUTER_PATHS } from '@/shared/constants/routes';
import RootLayout from '@/shared/ui/layouts/RootLayout';

const router = createBrowserRouter([
  {
    element: <RootLayout header={<h1>Header</h1>} />,
    path: ROUTER_PATHS.HOME,
    children: [
      {
        path: ROUTER_PATHS.HOME,
        loader: () => redirect(ROUTER_PATHS.USERS),
      },
      {
        path: ROUTER_PATHS.USERS,
        element: 'Users page',
      },
      {
        path: ROUTER_PATHS.BOARDS,
        element: 'Boards page',
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
