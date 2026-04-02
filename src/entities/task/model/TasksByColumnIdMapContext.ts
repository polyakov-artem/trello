import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

type TasksByColumnIdMap = Record<string, string[]>;

export const TasksByColumnIdMapContext = createStrictContext<TasksByColumnIdMap>();

export const useTasksByColumnIdMapContext = () => {
  return useStrictContext<TasksByColumnIdMap>(TasksByColumnIdMapContext);
};
