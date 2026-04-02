import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { Task } from '@/shared/types/types';

type TasksMapContextValue = Record<string, Task>;

export const TasksMapContext = createStrictContext<TasksMapContextValue>();

export const useTasksMapContext = () => {
  return useStrictContext<TasksMapContextValue>(TasksMapContext);
};
