import { useMemo, type FC, type PropsWithChildren } from 'react';
import { useBoardsQuery } from '@/entities/board';
import { TaskLocationMapContext, type TaskLocationMapContextValue } from './TaskLocationMapContext';

type TaskLocationMapProviderProps = PropsWithChildren;

export const TaskLocationMapProvider: FC<TaskLocationMapProviderProps> = ({ children }) => {
  const { boards } = useBoardsQuery();

  const map = useMemo(() => {
    const map: TaskLocationMapContextValue = {};

    if (!boards) return map;

    for (const board of boards) {
      for (const column of board.columns) {
        for (const taskId of column.tasksIds) {
          map[taskId] = { boardId: board.id, columnId: column.id };
        }
      }
    }

    return map;
  }, [boards]);

  return <TaskLocationMapContext value={map}>{children}</TaskLocationMapContext>;
};
