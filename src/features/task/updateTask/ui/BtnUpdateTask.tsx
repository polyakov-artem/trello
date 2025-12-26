import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { useUpdateTaskContext } from '../model/updateTaskContext';

export type BtnUpdateTaskProps = PropsWithClassName & {
  taskId: string;
};

export const BtnUpdateTask: FC<BtnUpdateTaskProps> = ({ className, taskId }) => {
  const { openModal } = useUpdateTaskContext();

  const handleClick = useCallback(() => {
    openModal({ taskId });
  }, [openModal, taskId]);

  return (
    <>
      <Button
        onClick={handleClick}
        color="green"
        variant="solid"
        className={className}
        iconPosition={'end'}>
        Edit
      </Button>
    </>
  );
};
