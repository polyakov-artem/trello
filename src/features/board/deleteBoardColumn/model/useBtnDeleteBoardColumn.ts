import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { useDeleteBoardColumn } from './useDeleteBoardColumn';
import { useTasksByColumnIdMapContext } from '@/entities/task';

export const COLUMN_DELETION_TITLE = 'Column deletion';
export const COLUMN_DELETION_TEXT = 'Do you really want to delete the column?';
export const TASKS_DELETION_TITLE = 'Tasks deletion';
export const TASKS_DELETION_TEXT = 'Do you also want to delete the tasks?';

export const useBtnDeleteBoardColumn = (columnId: string) => {
  const { getConfirmation } = useConfirmationContext();
  const tasksIds = useTasksByColumnIdMapContext()[columnId];
  const { deleteBoardColumn, isDeletingBoardColumn, canDeleteBoardColumn } =
    useDeleteBoardColumn(columnId);

  const deletionHandler = useCallback(async () => {
    const confirmation = await getConfirmation({
      title: COLUMN_DELETION_TITLE,
      body: COLUMN_DELETION_TEXT,
    });

    if (!confirmation) {
      return;
    }

    const deleteTasks =
      !!tasksIds.length &&
      (await getConfirmation({
        title: TASKS_DELETION_TITLE,
        body: TASKS_DELETION_TEXT,
      }));

    try {
      await deleteBoardColumn(deleteTasks);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, [deleteBoardColumn, getConfirmation, tasksIds.length]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return { isDeletingBoardColumn, handleClick, isDisabled: !canDeleteBoardColumn };
};
