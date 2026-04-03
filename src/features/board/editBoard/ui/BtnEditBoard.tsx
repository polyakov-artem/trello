import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { useCanEditBoard } from '../model/guards';
import { useEditBoardContext } from '../model/EditBoardContext';

export type BtnEditBoardProps = PropsWithClassName & {
  boardId: string;
};

export const BtnEditBoard: FC<BtnEditBoardProps> = ({ className, boardId }) => {
  const { openModal } = useEditBoardContext();
  const isBtnDisabled = !useCanEditBoard(boardId);

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
