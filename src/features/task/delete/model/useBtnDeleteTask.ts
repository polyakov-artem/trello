import { useCallback, useMemo, useState } from 'react';
import { useDeleteTask } from './useDeleteTask';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';

export const TITLE = 'Удаление задачи';
export const TEXT = 'Вы действительно хотите удалить задачу?';

export const useBtnDeleteTask = (taskId: string) => {
  const deleteTask = useDeleteTask();
  const [isDeleting, setIsDeleting] = useState(false);
  const { getConfirmation } = useConfirmationContext();

  const handleClick = useCallback(() => {
    void getConfirmation({
      title: TITLE,
      body: TEXT,
    })
      .then((confirmed) => {
        if (!confirmed) {
          return;
        }

        setIsDeleting(true);
        return deleteTask(taskId);
      })
      .then((result) => {
        if (result?.ok === false) {
          toast.error(result.error.message);
        }

        setIsDeleting(false);
      });
  }, [deleteTask, taskId, getConfirmation]);

  return useMemo(() => ({ isDeleting, handleClick }), [isDeleting, handleClick]);
};
