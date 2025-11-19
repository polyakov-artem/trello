import { useLoginWithSavedSession } from '@/features/auth/login';
import { useLoadUsers, useLoadSessionUser } from '@/features/user/view';
import { useLoadTasks } from '@/features/task/view';

import { useEffect, type FC, type PropsWithChildren } from 'react';

export const AppLoader: FC<PropsWithChildren> = ({ children }) => {
  const { loadUsers } = useLoadUsers();
  const { loginWithSavedSession } = useLoginWithSavedSession();
  const { loadSessionUser } = useLoadSessionUser();
  const { loadTasks } = useLoadTasks();

  useEffect(() => {
    void loadUsers();
    void loginWithSavedSession().then((result) => {
      if (result?.ok) {
        void loadSessionUser();
        void loadTasks();
      }
    });
  }, [loadSessionUser, loadTasks, loadUsers, loginWithSavedSession]);

  return <>{children}</>;
};
