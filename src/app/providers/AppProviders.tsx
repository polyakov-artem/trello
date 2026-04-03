import type { FC, PropsWithChildren } from 'react';
import { ConfirmationProvider } from '@/shared/ui/Confirmation/ConfirmationProvider';
import { queryClient } from '@/shared/api/queryClient/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { LogoutProvider } from './LogoutProvider';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmationProvider>
        <LogoutProvider>{children}</LogoutProvider>
      </ConfirmationProvider>
    </QueryClientProvider>
  );
};
