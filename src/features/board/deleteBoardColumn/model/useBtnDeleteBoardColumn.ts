import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { useCanDeleteBoardColumn } from './guards';
import { useDeleteBoardColumn } from './useDeleteBoardColumn';

export const COLUMN_DELETION_TITLE = 'Column deletion';
export const COLUMN_DELETION_TEXT = 'Do you really want to delete the column?';
export const TASKS_DELETION_TITLE = 'Tasks deletion';
export const TASKS_DELETION_TEXT = 'Do you also want to delete the tasks?';

export const useBtnDeleteBoardColumn = (
  boardId: string,
  columnId: string,
  columnHasTasks: boolean
) => {
  const canDeleteBoardColumn = useCanDeleteBoardColumn();
  const { getConfirmation } = useConfirmationContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const deleteBoardColumn = useDeleteBoardColumn();

  const deletionHandler = useCallback(async () => {
    const shouldDeleteColumn = await getConfirmation({
      title: COLUMN_DELETION_TITLE,
      body: COLUMN_DELETION_TEXT,
    });

    if (!shouldDeleteColumn) {
      return;
    }

    const shouldDeleteTasks =
      columnHasTasks &&
      (await getConfirmation({
        title: TASKS_DELETION_TITLE,
        body: TASKS_DELETION_TEXT,
      }));

    const result = await deleteBoardColumn({
      deleteTasks: shouldDeleteTasks,
      boardId,
      columnId,
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
    });

    if (result?.ok === false) {
      toast.error(result.error.message);
    }
  }, [boardId, columnHasTasks, columnId, deleteBoardColumn, getConfirmation]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return useMemo(
    () => ({ isProcessing, handleClick, isDisabled: !canDeleteBoardColumn }),
    [isProcessing, handleClick, canDeleteBoardColumn]
  );
};
