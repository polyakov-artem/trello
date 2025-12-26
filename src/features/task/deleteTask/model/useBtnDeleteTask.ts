import { useCallback, useMemo, useState } from 'react';
import { useDeleteTask } from './useDeleteTask';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { useCanDeleteTask } from './guards';

export const TITLE = 'Удаление задачи';
export const TEXT = 'Вы действительно хотите удалить задачу?';

export const useBtnDeleteTask = (taskId: string) => {
  const deleteTask = useDeleteTask();
  const canDeleteTask = useCanDeleteTask();
  const [isDeleting, setIsDeleting] = useState(false);
  const { getConfirmation } = useConfirmationContext();

  const deletionHandler = useCallback(async () => {
    const confirmed = await getConfirmation({
      title: TITLE,
      body: TEXT,
    });

    if (!confirmed) {
      return;
    }

    const result = await deleteTask(
      taskId,
      () => setIsDeleting(true),
      () => setIsDeleting(false)
    );

    if (result?.ok === false) {
      toast.error(result.error.message);
    }
  }, [deleteTask, getConfirmation, taskId]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return useMemo(
    () => ({ isDeleting, handleClick, isBtnDisabled: !canDeleteTask }),
    [isDeleting, handleClick, canDeleteTask]
  );
};
