import { useCallback, useMemo, type FC } from 'react';
import { Button } from 'antd';
import type { BaseButtonProps } from 'antd/es/button/button';
import { useTasksSelectionContext } from '@/entities/task';
import { useDeleteTasks } from '../model/useDeleteTasks';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { createWarningProps } from '../model/createWarningProps';
import { toast } from 'react-toastify';
import { useBoard } from '@/entities/board';

const useBtnDeleteColumnTasks = (columnId: string) => {
  const boardId = useBoard().id || '';
  const { currentMap } = useTasksSelectionContext();
  const tasksToDelete = useMemo(
    () => [...(currentMap.get(columnId) || [])],
    [columnId, currentMap]
  );
  const { deleteTasks, isDeletingTasks, isDisabled } = useDeleteTasks(tasksToDelete, boardId);
  const { getConfirmation } = useConfirmationContext();

  const deletionHandler = useCallback(async () => {
    const confirmed = await getConfirmation(createWarningProps(tasksToDelete.length));

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
  }, [deleteTasks, getConfirmation, tasksToDelete.length]);

  const handleClick = useCallback(() => {
    void deletionHandler();
  }, [deletionHandler]);

  return { isDeletingTasks, deleteTasks: handleClick, isDisabled };
};

export type BtnDeleteColumnTasksProps = BaseButtonProps & {
  columnId: string;
};

export const BtnDeleteColumnTasks: FC<BtnDeleteColumnTasksProps> = (props) => {
  const { columnId, ...restProps } = props;
  const { isDeletingTasks, deleteTasks, isDisabled } = useBtnDeleteColumnTasks(columnId);
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
