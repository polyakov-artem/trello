import { createBrowserRouter, redirect, RouterProvider } from 'react-router';
import { ROUTER_PATHS } from '@/shared/constants/routes';
import { RootLayout } from '@/shared/ui/layouts/RootLayout/RootLayout';
import { UsersPage } from '@/pages/users/usersPage';
import { Header } from '@/widgets/Header';
import { TasksPage } from '@/pages/tasks/tasksPage';

const router = createBrowserRouter([
  {
    element: <RootLayout header={<Header />} />,
    path: ROUTER_PATHS.HOME,
    children: [
      {
        index: true,
        loader: () => redirect(ROUTER_PATHS.USERS),
      },
      {
        path: ROUTER_PATHS.USERS,
        element: <UsersPage />,
      },
      {
        path: ROUTER_PATHS.BOARDS,
        element: 'Boards page',
      },
      {
        path: ROUTER_PATHS.TASKS,
        element: <TasksPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
