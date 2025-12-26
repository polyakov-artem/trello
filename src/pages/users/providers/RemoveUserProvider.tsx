import { useLogout } from '@/features/auth/logout';
import { RemoveUserContext } from '@/features/user/removeUser';
import { useMemo, type FC, type PropsWithChildren } from 'react';

export const RemoveUserProvider: FC<PropsWithChildren> = ({ children }) => {
  const logout = useLogout();

  const value = useMemo(
    () => ({
      logout,
    }),
    [logout]
  );

  return <RemoveUserContext value={value}>{children}</RemoveUserContext>;
};
