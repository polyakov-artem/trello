import { useLoadUsers } from '@/features/manageUser';
import { useEffect, type FC, type PropsWithChildren } from 'react';

export const AppLoader: FC<PropsWithChildren> = ({ children }) => {
  const { loadUsers } = useLoadUsers();

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return <>{children}</>;
};
