import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC, type PropsWithChildren } from 'react';
import { useCreateColumnTaskContext } from '../model/CreateColumnTaskContext';
import type { BaseButtonProps } from 'antd/es/button/button';
import { useCanCreateColumnTask } from '../model/guards';

export type BtnCreateColumnTaskProps = {
  size?: BaseButtonProps['size'];
  columnId: string;
  boardId: string;
} & PropsWithClassName &
  PropsWithChildren;

export const BtnCreateColumnTask: FC<BtnCreateColumnTaskProps> = ({
  className,
  children,
  size,
  columnId,
  boardId,
}) => {
  const canCreateColumnTask = useCanCreateColumnTask();
  const { openModal } = useCreateColumnTaskContext();

  const handleClick = useCallback(
    () => openModal({ columnId, boardId }),
    [boardId, columnId, openModal]
  );

  return (
    <Button
      disabled={!canCreateColumnTask}
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
