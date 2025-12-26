import type { FC, PropsWithChildren } from 'react';
import { ConfirmationProvider } from '@/shared/ui/Confirmation/ConfirmationProvider';
import { LoginWithAutoLogoutProvider } from './LoginWithAutoLogoutProvider';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfirmationProvider>
      <LoginWithAutoLogoutProvider>{children}</LoginWithAutoLogoutProvider>
    </ConfirmationProvider>
  );
};
