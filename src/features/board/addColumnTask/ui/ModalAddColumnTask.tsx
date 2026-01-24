import { type FC } from 'react';
import { BaseModalCreateTask } from '@/entities/task';
import { useModalAddColumnTask } from '../model/useModalAddColumnTask';

export const ModalAddColumnTask: FC = () => {
  const modalProps = useModalAddColumnTask();

  return <BaseModalCreateTask {...modalProps} />;
};
