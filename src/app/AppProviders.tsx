import { Confirmation } from '@/shared/ui/Confirmation/Confirmation';
import type { FC, PropsWithChildren } from 'react';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return <Confirmation>{children}</Confirmation>;
};
