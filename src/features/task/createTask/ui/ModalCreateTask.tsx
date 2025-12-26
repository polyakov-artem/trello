import { type FC } from 'react';
import { useModalCreateTask } from '../model/useModalCreateTask';
import { BaseModalCreateTask } from '@/entities/task';

export const ModalCreateTask: FC = () => {
  const modalProps = useModalCreateTask();

  return <BaseModalCreateTask {...modalProps} />;
};
