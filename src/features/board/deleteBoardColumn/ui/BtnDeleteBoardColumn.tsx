import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { type FC, type PropsWithChildren } from 'react';
import type { Board } from '@/shared/api/board/boardApi';
import { useBtnDeleteBoardColumn } from '../model/useBtnDeleteBoardColumn';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnDeleteBoardColumnProps = {
  board: Board;
  columnId: string;
  size?: BaseButtonProps['size'];
} & PropsWithClassName &
  PropsWithChildren;

export const BtnDeleteBoardColumn: FC<BtnDeleteBoardColumnProps> = ({
  className,
  board,
  columnId,
  size,
  children,
}) => {
  const { isProcessing, handleClick, isDisabled } = useBtnDeleteBoardColumn(board, columnId);

  return (
    <Button
      size={size}
      loading={isProcessing}
      disabled={isDisabled}
      onClick={handleClick}
      color="red"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      {children}
    </Button>
  );
};
