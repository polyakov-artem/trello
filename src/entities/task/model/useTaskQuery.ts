import { errorNames } from '@/shared/lib/safeFetch';

import { useMemo } from 'react';
import { useTasksQuery } from './useTasksQuery';

const errorNotFound = { message: 'Task was not found', name: errorNames.http };

export const useTaskQuery = (taskId: string) => {
  const { tasksError, isFetchingTasks, isPendingTasks, tasks } = useTasksQuery();

  const task = useMemo(() => {
    return tasks?.find((task) => task.id === taskId);
  }, [tasks, taskId]);

  const taskError = isFetchingTasks
    ? undefined
    : tasksError
      ? tasksError
      : task
        ? undefined
        : errorNotFound;

  return { taskError, isFetchingTask: isFetchingTasks, isPendingTask: isPendingTasks, task };
};
