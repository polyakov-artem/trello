import type { useQueryParamApiWithAutoClean } from '@/shared/lib/queryParamWithPathApi';
import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type TasksSelectionContextValue = ReturnType<typeof useQueryParamApiWithAutoClean>;

export const TasksSelectionContext = createStrictContext<TasksSelectionContextValue>();

export const useTasksSelectionContext = () => {
  return useStrictContext<TasksSelectionContextValue>(TasksSelectionContext);
};
