import { useLoginWithSavedSession } from '@/features/auth/login';
import { useLoadUsers, useLoadSessionUser } from '@/features/user/load';
import { useEffect, type FC, type PropsWithChildren } from 'react';
import { useLoadTasks } from '@/features/task/load';
import { useLoadBoards } from '@/features/board/load';

export const AppLoader: FC<PropsWithChildren> = ({ children }) => {
  const loadUsers = useLoadUsers();
  const loginWithSavedSession = useLoginWithSavedSession();
  const loadSessionUser = useLoadSessionUser();
  const loadTasks = useLoadTasks();
  const loadBoards = useLoadBoards();

  useEffect(() => {
    void loadUsers();
    void loginWithSavedSession().then((result) => {
      if (result?.ok) {
        void loadSessionUser();
        void loadTasks();
        void loadBoards();
      }
    });
  }, [loadBoards, loadSessionUser, loadTasks, loadUsers, loginWithSavedSession]);

  return <>{children}</>;
};
