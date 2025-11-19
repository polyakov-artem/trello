import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { useModalUpdateTaskContext } from '@/shared/lib/updateModalContext';

export type BtnUpdateTaskProps = PropsWithClassName & {
  taskId: string;
};

export const BtnUpdateTask: FC<BtnUpdateTaskProps> = ({ className, taskId }) => {
  const { showModal } = useModalUpdateTaskContext();

  const handleClick = useCallback(() => {
    showModal({ taskId });
  }, [showModal, taskId]);

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
