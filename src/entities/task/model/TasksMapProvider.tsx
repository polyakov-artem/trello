import { useMemo, type FC, type PropsWithChildren } from 'react';
import { TasksMapContext } from './TasksMapContext';
import { useTasksQuery } from './useTasksQuery';
import type { Task } from '@/shared/types/types';

export const TasksMapProvider: FC<PropsWithChildren> = ({ children }) => {
  const { tasks } = useTasksQuery();

  const map = useMemo(() => {
    const map: Record<string, Task> = {};

    if (!tasks) return map;

    return tasks.reduce((acc, task) => {
      acc[task.id] = task;

      return acc;
    }, map);
  }, [tasks]);

  return <TasksMapContext value={map}>{children}</TasksMapContext>;
};
