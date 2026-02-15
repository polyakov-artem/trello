import { useCallback, useState } from 'react';
import { useDeleteTasks } from './useDeleteTasks';
import { toast } from 'react-toastify';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { pluralizeWord } from '@/shared/lib/pluralizeWord';

const createWarningProps = (quantity: number) => {
  return {
    title: `Удаление ${pluralizeWord(quantity, {
      one: 'задачи',
      few: 'задач',
      many: 'задач',
    })}`,
    body: `Вы действительно хотите удалить ${quantity} ${pluralizeWord(quantity, {
      one: 'задачу',
      few: 'задачи',
      many: 'задач',
    })}?`,
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
