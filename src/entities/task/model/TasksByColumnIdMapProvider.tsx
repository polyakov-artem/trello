import { useMemo, type FC, type PropsWithChildren } from 'react';
import { TasksByColumnIdMapContext } from './TasksByColumnIdMapContext';
import { useBoard } from '@/entities/board/model/useBoard';

type TasksByColumnIdMapProviderProps = PropsWithChildren;

export const TasksByColumnIdMapProvider: FC<TasksByColumnIdMapProviderProps> = ({ children }) => {
  const board = useBoard();

  const map = useMemo(() => {
    const map: Record<string, string[]> = {};

    for (const column of board.columns) {
      map[column.id] = column.tasksIds;
    }

    return map;
  }, [board]);

  return <TasksByColumnIdMapContext value={map}>{children}</TasksByColumnIdMapContext>;
};
