import type { FC, PropsWithChildren } from 'react';
import { EditTaskContext, type ModalDetails } from './EditTaskContext';
import { useModalProps } from '@/shared/ui/Modal/useModalProps';

export const EditTaskProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useModalProps<ModalDetails>();

  return <EditTaskContext value={value}>{children}</EditTaskContext>;
};
