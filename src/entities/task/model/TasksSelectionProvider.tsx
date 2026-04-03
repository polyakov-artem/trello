import { type FC, type PropsWithChildren } from 'react';
import { TasksSelectionContext } from './TasksSelectionContext';
import { QUERY_PARAMS } from '@/shared/config/queryParams';
import { useQueryParamApiWithAutoClean } from '@/shared/lib/queryParamWithPathApi';
import { useTasksByColumnIdMapContext } from './TasksByColumnIdMapContext';

type TasksSelectionProviderProps = PropsWithChildren;

export const TasksSelectionProvider: FC<TasksSelectionProviderProps> = ({ children }) => {
  const validValuesByPath = useTasksByColumnIdMapContext();
  const queryApi = useQueryParamApiWithAutoClean(QUERY_PARAMS.SELECTED_TASK_IDS, validValuesByPath);
  return <TasksSelectionContext value={queryApi}>{children}</TasksSelectionContext>;
};
