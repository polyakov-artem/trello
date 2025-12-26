import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { type FC } from 'react';
import { useCreateTaskContext } from '../model/CreateTaskContext';

export type BtnCreateTaskProps = PropsWithClassName;

export const BtnCreateTask: FC<BtnCreateTaskProps> = ({ className }) => {
  const { openModal } = useCreateTaskContext();

  return (
    <Button
      size="large"
      onClick={openModal}
      color="green"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      Create task
    </Button>
  );
};
