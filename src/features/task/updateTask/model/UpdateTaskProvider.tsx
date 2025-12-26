import type { FC, PropsWithChildren } from 'react';
import { UpdateTaskContext, type ModalDetails } from './updateTaskContext';
import { useModalProps } from '@/shared/ui/Modal/useModalProps';

export const UpdateTaskProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = useModalProps<ModalDetails>();

  return <UpdateTaskContext value={value}>{children}</UpdateTaskContext>;
};
