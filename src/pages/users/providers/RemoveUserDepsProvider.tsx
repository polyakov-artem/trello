import { useLogout } from '@/features/auth/logout';
import { RemoveUserDepsContext } from '@/features/user/remove';
import type { FC, PropsWithChildren } from 'react';

export const RemoveUserDepsProvider: FC<PropsWithChildren> = ({ children }) => {
  const logout = useLogout();

  return <RemoveUserDepsContext value={logout}>{children}</RemoveUserDepsContext>;
};
