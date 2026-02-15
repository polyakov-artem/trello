import type { FC, PropsWithChildren } from 'react';
import { TasksSelectionContext } from './TasksSelectionContext';

import { QUERY_PARAMS } from '@/shared/config/queryParams';
import { useQueryParamApiWithAutoClean } from '@/shared/lib/queryParamWithPathApi';

type TasksSelectionProviderProps = {
  validValuesByPath: Record<string, string[]>;
} & PropsWithChildren;

export const TasksSelectionProvider: FC<TasksSelectionProviderProps> = ({
  children,
  validValuesByPath,
}) => {
  const queryApi = useQueryParamApiWithAutoClean(QUERY_PARAMS.SELECTED_TASK_IDS, validValuesByPath);

  return <TasksSelectionContext value={queryApi}>{children}</TasksSelectionContext>;
};
