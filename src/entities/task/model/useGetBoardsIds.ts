import { useMemo } from 'react';
import { useTaskLocationMapContext } from './TaskLocationMapContext';

export const useGetBoardsIds = (tasksIds: string[]) => {
  const tasksLocationMap = useTaskLocationMapContext();

  return useMemo(() => {
    const result: string[] = [];

    for (const taskId of tasksIds) {
      const boardId = tasksLocationMap[taskId]?.boardId;

      if (boardId) {
        result.push(boardId);
      } else {
        return [];
      }
    }

    return result;
  }, [tasksIds, tasksLocationMap]);
};
