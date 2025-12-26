import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { useCanDeleteBoardColumn } from './guards';
import { useDeleteBoardColumn } from './useDeleteBoardColumn';

export const TITLE = 'Удаление колонки';
export const TEXT = 'Вы действительно хотите удалить колонку?';

export const useBtnDeleteBoardColumn = (boardId: string, columnId: string) => {
  const canDeleteBoardColumn = useCanDeleteBoardColumn();
  const { getConfirmation } = useConfirmationContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const deleteBoardColumn = useDeleteBoardColumn();

  const deletionHandler = useCallback(async () => {
    const confirmed = await getConfirmation({
      title: TITLE,
      body: TEXT,
    });

    if (!confirmed) {
      return;
    }

    const result = await deleteBoardColumn({
      boardId,
      columnId,
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
    });

    if (result?.ok === false) {
      toast.error(result.error.message);
    }
  }, [boardId, columnId, deleteBoardColumn, getConfirmation]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return useMemo(
    () => ({ isProcessing, handleClick, isDisabled: !canDeleteBoardColumn }),
    [isProcessing, handleClick, canDeleteBoardColumn]
  );
};
