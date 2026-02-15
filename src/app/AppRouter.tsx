import { createBrowserRouter, redirect, RouterProvider } from 'react-router';
import { ROUTER_PATHS } from '@/shared/config/routes';
import { RootLayout } from '@/shared/ui/layouts/RootLayout/RootLayout';
import { UsersPage } from '@/pages/users';
import { Header } from '@/widgets/Header';
import { TasksPage } from '@/pages/tasks';
import { BoardsPage } from '@/pages/boards';
import { DnDBoardPage } from '@/pages/dndBoard';

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
        path: ROUTER_PATHS.TASKS,
        element: <TasksPage />,
      },
      {
        path: ROUTER_PATHS.BOARDS,
        element: <BoardsPage />,
      },
      {
        path: ROUTER_PATHS.BOARD,
        element: <DnDBoardPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
