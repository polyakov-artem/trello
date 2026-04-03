import type { FC, PropsWithChildren } from 'react';
import { useLogout } from '@/features/auth/logout';
import { LogoutContext } from '@/entities/session';

export const LogoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useLogout();
  return <LogoutContext value={value}>{children}</LogoutContext>;
};
