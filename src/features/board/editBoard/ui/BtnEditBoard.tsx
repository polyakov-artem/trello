import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { useEditBoardContext } from '../model/EditBoardContext';
import { useCanUpdateBoard } from '../model/guards';

export type BtnUpdateBoardProps = PropsWithClassName & {
  boardId: string;
};

export const BtnEditBoard: FC<BtnUpdateBoardProps> = ({ className, boardId }) => {
  const { openModal } = useEditBoardContext();
  const isBtnDisabled = !useCanUpdateBoard(boardId);

  const handleClick = useCallback(() => {
    openModal({ boardId });
  }, [openModal, boardId]);

  return (
    <Button
      disabled={isBtnDisabled}
      onClick={handleClick}
      color="green"
      variant="solid"
      className={className}
      iconPosition={'end'}>
      Edit
    </Button>
  );
};
