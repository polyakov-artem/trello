import type { FC, PropsWithChildren } from 'react';

import { useModalProps } from '@/shared/ui/Modal/useModalProps';
import { EditBoardTitleContext, type ModalDetails } from './EditBoardTitleContext';

export const EditBoardTitleProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useModalProps<ModalDetails>();

  return <EditBoardTitleContext value={value}>{children}</EditBoardTitleContext>;
};
