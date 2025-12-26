import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { useCanUpdateBoardTitle } from '../model/guards';
import { useEditBoardTitleContext } from '../model/EditBoardTitleContext';

export type BtnUpdateBoardProps = PropsWithClassName & {
  boardId: string;
};

export const BtnEditBoardTitle: FC<BtnUpdateBoardProps> = ({ className, boardId }) => {
  const { openModal } = useEditBoardTitleContext();
  const isBtnDisabled = !useCanUpdateBoardTitle();

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
