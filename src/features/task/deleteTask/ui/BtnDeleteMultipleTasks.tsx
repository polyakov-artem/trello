import { useMemo, type FC } from 'react';
import { Button } from 'antd';
import type { BaseButtonProps } from 'antd/es/button/button';
import { useBtnDeleteTasksBase } from '../model/useBtnDeleteTasksBase';
import { useTasksSelectionContext } from '@/entities/task';
import { useCanDeleteTask } from '../model/guards';

const useBtnDeleteMultipleTasks = (columnId: string, tasksIds: string[]) => {
  const { currentMap } = useTasksSelectionContext();

  const tasksToDelete = useMemo(
    () => tasksIds.filter((taskId) => currentMap.get(columnId)?.has(taskId) === true),
    [columnId, currentMap, tasksIds]
  );
  const { isLoading, handleClick } = useBtnDeleteTasksBase(tasksToDelete);

  const canDeleteTasks = useCanDeleteTask();
  const isDisabled = tasksToDelete.length === 0 || !canDeleteTasks;
  return { isLoading, handleClick, isDisabled };
};

export type BtnDeleteMultipleTasksProps = BaseButtonProps & {
  columnId: string;
  tasksIds: string[];
};

export const BtnDeleteMultipleTasks: FC<BtnDeleteMultipleTasksProps> = (props) => {
  const { columnId, tasksIds, ...restProps } = props;
  const { isLoading, handleClick, isDisabled } = useBtnDeleteMultipleTasks(columnId, tasksIds);
  return (
    <Button
      color="red"
      variant="solid"
      iconPosition={'end'}
      {...restProps}
      onClick={handleClick}
      disabled={isDisabled}
      loading={isLoading}
    />
  );
};
