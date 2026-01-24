import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC, type PropsWithChildren } from 'react';
import { useAddColumnTaskContext } from '../model/AddColumnTaskContext';
import { useCanAddColumnTask } from '../model/guards';
import type { Board, BoardColumn } from '@/shared/api/board/boardApi';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnAddColumnTaskProps = {
  board: Board;
  column: BoardColumn;
  size?: BaseButtonProps['size'];
} & PropsWithClassName &
  PropsWithChildren;

export const BtnAddColumnTask: FC<BtnAddColumnTaskProps> = ({
  className,
  children,
  size,
  column,
  board,
}) => {
  const { openModal } = useAddColumnTaskContext();
  const isBtnDisabled = !useCanAddColumnTask();

  const handleClick = useCallback(() => {
    openModal({ column, board });
  }, [board, column, openModal]);

  return (
    <Button
      size={size}
      disabled={isBtnDisabled}
      onClick={handleClick}
      color="green"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      {children}
    </Button>
  );
};
