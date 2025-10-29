import { useLoginWithSavedSession } from '@/features/auth';
import {
  useLoadUsers,
  useAutoSyncSessionUser,
  useLoadSessionUserById,
} from '@/features/manageUser';

import { useEffect, type FC, type PropsWithChildren } from 'react';

export const AppLoader: FC<PropsWithChildren> = ({ children }) => {
  const { loadUsers } = useLoadUsers();
  const { loginWithSavedSession } = useLoginWithSavedSession();
  const { loadSessionUserById } = useLoadSessionUserById();

  useAutoSyncSessionUser(loadSessionUserById);

  useEffect(() => {
    void loadUsers();
    void loginWithSavedSession();
  }, [loadUsers, loginWithSavedSession]);

  return <>{children}</>;
};
