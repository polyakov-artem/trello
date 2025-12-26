import type { FC, PropsWithChildren } from 'react';

import { useModalProps } from '@/shared/ui/Modal/useModalProps';
import { AddBoardColumnContext, type Details } from './AddBoardColumnContext';

export const AddBoardColumnProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useModalProps<Details>();

  return <AddBoardColumnContext value={value}>{children}</AddBoardColumnContext>;
};
