import { type FC } from 'react';
import { Button } from 'antd';
import type { PropsWithClassName } from '@/shared/types/types';
import { useBtnDeleteBoard } from '../model/useBtnDeleteBoard';

export type BtnDeleteBoardProps = {
  boardId: string;
} & PropsWithClassName;

export const TITLE = 'Delete';

export const BtnDeleteBoard: FC<BtnDeleteBoardProps> = ({ boardId, className }) => {
  const { isProcessing, handleClick, isBtnDisabled } = useBtnDeleteBoard(boardId);

  return (
    <Button
      disabled={isBtnDisabled}
      loading={isProcessing}
      onClick={handleClick}
      color="red"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      {TITLE}
    </Button>
  );
};
