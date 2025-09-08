import { createBrowserRouter, redirect, RouterProvider } from 'react-router';
import { ROUTER_PATHS } from '@/shared/constants/routes';
import RootLayout from '@/shared/ui/layouts/RootLayout/RootLayout';
import { Header } from '@/widgets/header';
import { UserPreview } from '@/entities/user';

const router = createBrowserRouter([
  {
    element: (
      <RootLayout header={<Header userPreview={<UserPreview avatarId={1} name="John Doe" />} />} />
    ),
    path: ROUTER_PATHS.HOME,
    children: [
      {
        index: true,
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
