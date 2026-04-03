import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC, type PropsWithChildren } from 'react';
import { useCreateColumnTaskContext } from '../model/CreateColumnTaskContext';
import type { BaseButtonProps } from 'antd/es/button/button';
import { useCanCreateColumnTask } from '../model/guards';

export type BtnCreateColumnTaskProps = {
  columnId: string;
  size?: BaseButtonProps['size'];
} & PropsWithClassName &
  PropsWithChildren;

export const BtnCreateColumnTask: FC<BtnCreateColumnTaskProps> = ({
  className,
  children,
  size,
  columnId,
}) => {
  const isDisabled = !useCanCreateColumnTask();
  const { openModal } = useCreateColumnTaskContext();
  const handleClick = useCallback(() => openModal({ columnId }), [columnId, openModal]);

  return (
    <Button
      disabled={isDisabled}
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
