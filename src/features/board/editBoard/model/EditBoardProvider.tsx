import type { FC, PropsWithChildren } from 'react';

import { useModalProps } from '@/shared/ui/Modal/useModalProps';
import { EditBoardContext, type ModalDetails } from './EditBoardContext';

export const EditBoardProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useModalProps<ModalDetails>();

  return <EditBoardContext value={value}>{children}</EditBoardContext>;
};
