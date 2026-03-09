import { useCallback, useState } from 'react';
import { useDeleteTasks } from './useDeleteTasks';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';

const createWarningProps = (quantity: number) => {
  return {
    title: `Task${quantity > 1 ? 's' : ''} deletion`,
    body: `Do you really want to delete ${quantity} task${quantity > 1 ? 's' : ''}?`,
  };
};
export const useBtnDeleteTasksBase = (value: string[] | string) => {
  const deleteTasks = useDeleteTasks();
  const [isLoading, setIsLoading] = useState(false);
  const { getConfirmation } = useConfirmationContext();

  const deletionHandler = useCallback(async () => {
    const tasksIds = Array.isArray(value) ? value : [value];

    const confirmed = await getConfirmation(createWarningProps(tasksIds.length));

    if (!confirmed) {
      return;
    }

    const result = await deleteTasks(
      tasksIds,
      () => setIsLoading(true),
      () => setIsLoading(false)
    );

    if (result?.ok === false) {
      toast.error(result.error.message);
    }
  }, [deleteTasks, getConfirmation, value]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return { isLoading, handleClick };
};
