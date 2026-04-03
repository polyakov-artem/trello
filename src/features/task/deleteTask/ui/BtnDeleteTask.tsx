import { useCallback, type FC } from 'react';
import { Button } from 'antd';
import type { BaseButtonProps } from 'antd/es/button/button';
import { useDeleteTasks } from '../model/useDeleteTasks';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { toast } from 'react-toastify';
import { createWarningProps } from '../model/createWarningProps';

const useBtnDeleteTask = (taskId: string, boardId: string) => {
  const { deleteTasks, isDeletingTasks, isDisabled } = useDeleteTasks(taskId, boardId);
  const { getConfirmation } = useConfirmationContext();

  const deletionHandler = useCallback(async () => {
    const confirmed = await getConfirmation(createWarningProps());

    if (!confirmed) {
      return;
    }

    try {
      await deleteTasks();
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  }, [deleteTasks, getConfirmation]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return { isDeletingTasks, deleteTasks: handleClick, isDisabled };
};

export type BtnDeleteTaskProps = BaseButtonProps & {
  taskId: string;
  boardId: string;
};

export const BtnDeleteTask: FC<BtnDeleteTaskProps> = ({ taskId, boardId, ...restProps }) => {
  const { isDeletingTasks, deleteTasks, isDisabled } = useBtnDeleteTask(taskId, boardId);

  return (
    <Button
      color="red"
      variant="solid"
      iconPosition={'end'}
      {...restProps}
      onClick={deleteTasks}
      disabled={isDisabled}
      loading={isDeletingTasks}
    />
  );
};
