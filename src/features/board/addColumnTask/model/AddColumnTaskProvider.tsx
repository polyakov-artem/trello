import type { FC, PropsWithChildren } from 'react';

import { useModalProps } from '@/shared/ui/Modal/useModalProps';
import { AddColumnTaskContext, type ModalDetails } from './AddColumnTaskContext';

export const AddColumnTaskProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useModalProps<ModalDetails>();

  return <AddColumnTaskContext value={value}>{children}</AddColumnTaskContext>;
};
