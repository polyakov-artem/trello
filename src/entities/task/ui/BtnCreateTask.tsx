import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC, type PropsWithChildren } from 'react';
import { useCreateTaskContext } from '../model/CreateTaskContext';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnCreateTaskProps = {
  size?: BaseButtonProps['size'];
  columnId?: string;
  boardId?: string;
} & PropsWithClassName &
  PropsWithChildren;

export const BtnCreateTask: FC<BtnCreateTaskProps> = ({
  className,
  children,
  size,
  columnId,
  boardId,
}) => {
  const { openModal } = useCreateTaskContext();

  const handleClick = useCallback(
    () => openModal({ columnId, boardId }),
    [boardId, columnId, openModal]
  );

  return (
    <Button
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
