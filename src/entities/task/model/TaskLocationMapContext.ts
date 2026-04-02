import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type TaskLocationMapContextValue = Record<string, { boardId: string; columnId: string }>;

export const TaskLocationMapContext = createStrictContext<TaskLocationMapContextValue>();

export const useTaskLocationMapContext = () => {
  return useStrictContext<TaskLocationMapContextValue>(TaskLocationMapContext);
};
