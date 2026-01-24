import { useSessionStore } from '@/entities/session';
import type { Board, BoardColumn } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanAddColumnTaskFn } from './guards';
import { useUpdateBoardFx } from '@/entities/board';
import { useCreateTaskFx } from '@/entities/task';
import type { TaskDraft } from '@/shared/api/task/taskApi';

export const useAddColumnTask = () => {
  const canAddColumnTask = useCanAddColumnTaskFn();
  const updateBoard = useUpdateBoardFx();
  const createTaskFx = useCreateTaskFx();
  const getSessionState = useSessionStore.use.getState();

  return useCallback(
    async (
      board: Board,
      column: BoardColumn,
      taskDraft: TaskDraft,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      if (!canAddColumnTask()) {
        return;
      }

      onStart?.();

      const sessionId = getSessionState().value?.sessionId || '';

      const taskCreationResult = await createTaskFx(sessionId, taskDraft);

      if (taskCreationResult?.ok !== true) {
        onEnd?.();
        return taskCreationResult;
      }

      const updatedColumn = {
        ...column,
        tasksIds: [...column.tasksIds, taskCreationResult.data.id],
      };

      const boardDraft = {
        ...board,
        columns: board.columns.map((c) => (c.id === column.id ? updatedColumn : c)),
      };

      const result = await updateBoard(sessionId, board.id, boardDraft);
      onEnd?.();
      return result;
    },
    [canAddColumnTask, createTaskFx, getSessionState, updateBoard]
  );
};
