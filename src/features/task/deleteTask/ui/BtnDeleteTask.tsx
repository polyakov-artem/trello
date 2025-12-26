import { type FC, type PropsWithChildren } from 'react';
import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useBtnDeleteTask } from '../model/useBtnDeleteTask';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnDeleteTaskProps = {
  taskId: string;
  size?: BaseButtonProps['size'];
} & PropsWithClassName &
  PropsWithChildren;

export const BtnDeleteTask: FC<BtnDeleteTaskProps> = ({ taskId, className, children, size }) => {
  const { isDeleting, handleClick, isBtnDisabled } = useBtnDeleteTask(taskId);

  return (
    <Button
      disabled={isBtnDisabled}
      loading={isDeleting}
      size={size}
      onClick={handleClick}
      color="red"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      {children}
    </Button>
  );
};
