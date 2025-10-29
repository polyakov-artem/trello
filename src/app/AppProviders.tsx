import { ConfirmationProvider } from '@/shared/ui/Confirmation/ConfirmationProvider';
import type { FC, PropsWithChildren } from 'react';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return <ConfirmationProvider>{children}</ConfirmationProvider>;
};
