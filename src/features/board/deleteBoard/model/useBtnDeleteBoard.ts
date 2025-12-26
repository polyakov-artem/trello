import { useCallback, useMemo, useState } from 'react';
import { useDeleteBoard } from './useDeleteBoard';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { useCanDeleteBoard } from './guards';

export const TITLE = 'Удаление доски';
export const TEXT = 'Вы действительно хотите удалить доску?';

export const useBtnDeleteBoard = (boardId: string) => {
  const deleteBoard = useDeleteBoard();
  const canDeleteBoard = useCanDeleteBoard();
  const [isProcessing, setIsProcessing] = useState(false);
  const { getConfirmation } = useConfirmationContext();

  const deletionHandler = useCallback(async () => {
    const confirmed = await getConfirmation({
      title: TITLE,
      body: TEXT,
    });

    if (!confirmed) {
      return;
    }

    const result = await deleteBoard({
      boardId,
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
    });

    if (result?.ok === false) {
      toast.error(result.error.message);
    }
  }, [deleteBoard, boardId, getConfirmation]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return useMemo(
    () => ({ isProcessing, handleClick, isBtnDisabled: !canDeleteBoard }),
    [isProcessing, handleClick, canDeleteBoard]
  );
};
