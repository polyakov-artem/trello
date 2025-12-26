import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC, type PropsWithChildren } from 'react';
import { useEditTaskContext } from '../model/EditTaskContext';
import type { BaseButtonProps } from 'antd/es/button/button';
import { useCanUpdateTask } from '../model/guards';

export type BtnUpdateTaskProps = PropsWithChildren &
  PropsWithClassName & {
    taskId: string;
    size?: BaseButtonProps['size'];
  };

export const BtnEditTask: FC<BtnUpdateTaskProps> = ({ className, taskId, children, size }) => {
  const { openModal } = useEditTaskContext();
  const isBtnDisabled = !useCanUpdateTask();

  const handleClick = useCallback(() => {
    openModal({ taskId });
  }, [openModal, taskId]);

  return (
    <Button
      disabled={isBtnDisabled}
      size={size}
      onClick={handleClick}
      color="green"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      {children}
    </Button>
  );
};
