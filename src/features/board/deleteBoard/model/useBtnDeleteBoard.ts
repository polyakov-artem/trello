import { useCallback } from 'react';
import { useDeleteBoard } from './useDeleteBoard';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';

export const TITLE = 'Board deletion';
export const TEXT = 'Do you really want to delete the board?';

export const useBtnDeleteBoard = (boardId: string) => {
  const { deleteBoard, isDeletingBoard, canDeleteBoard } = useDeleteBoard(boardId);
  const { getConfirmation } = useConfirmationContext();

  const deletionHandler = useCallback(async () => {
    const confirmed = await getConfirmation({
      title: TITLE,
      body: TEXT,
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteBoard();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [deleteBoard, getConfirmation]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return { isDeletingBoard, handleClick, isBtnDisabled: !canDeleteBoard };
};
