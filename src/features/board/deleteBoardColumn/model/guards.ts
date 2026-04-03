import { useTasksByColumnIdMapContext } from './../../../../entities/task/model/TasksByColumnIdMapContext';
import { useBoard, useIsModifyingBoards } from '@/entities/board';
import { useSessionId } from '@/entities/session';
import { useIsModifyingTasks } from '@/entities/task';

export const useCanDeleteBoardColumn = (columnId: string) => {
  const sessionId = useSessionId();
  const tasksIds = useTasksByColumnIdMapContext()[columnId];
  const boardId = useBoard().id;
  const isModifyingTasks = useIsModifyingTasks(tasksIds);
  const isModifyingBoards = useIsModifyingBoards(boardId);

  return !isModifyingTasks && !!sessionId && !isModifyingBoards;
};
