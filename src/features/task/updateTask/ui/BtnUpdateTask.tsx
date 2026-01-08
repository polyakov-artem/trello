import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC, type PropsWithChildren } from 'react';
import { useUpdateTaskContext } from '../model/updateTaskContext';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnUpdateTaskProps = PropsWithChildren &
  PropsWithClassName & {
    taskId: string;
    size?: BaseButtonProps['size'];
  };

export const BtnUpdateTask: FC<BtnUpdateTaskProps> = ({ className, taskId, children, size }) => {
  const { openModal } = useUpdateTaskContext();

  const handleClick = useCallback(() => {
    openModal({ taskId });
  }, [openModal, taskId]);

  return (
    <>
      <Button
        size={size}
        onClick={handleClick}
        color="green"
        variant="solid"
        className={className}
        iconPosition={'end'}>
        {children}
      </Button>
    </>
  );
};
