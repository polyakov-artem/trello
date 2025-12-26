import { LoginWithAutoLogoutContext } from '@/features/auth/login';
import { useLogout } from '@/features/auth/logout';
import { useMemo, type FC, type PropsWithChildren } from 'react';

export const LoginWithAutoLogoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const logout = useLogout();

  const value = useMemo(
    () => ({
      logout,
    }),
    [logout]
  );

  return <LoginWithAutoLogoutContext value={value}>{children}</LoginWithAutoLogoutContext>;
};
