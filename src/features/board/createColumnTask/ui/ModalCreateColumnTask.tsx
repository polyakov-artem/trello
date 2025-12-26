import { type FC } from 'react';
import { BaseModalCreateTask } from '@/entities/task';
import { useModalCreateColumnTask } from '../model/useModalCreateColumnTask';

export const ModalCreateColumnTask: FC = () => {
  const modalProps = useModalCreateColumnTask();

  return <BaseModalCreateTask {...modalProps} />;
};
