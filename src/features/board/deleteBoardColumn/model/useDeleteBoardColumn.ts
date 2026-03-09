import { useSessionStore } from '@/entities/session';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanDeleteBoardColumnFn } from './guards';
import { useBoardsStoreActions, useBoardUpdateStore } from '@/entities/board';
import { useTaskDeletionStore, useTasksStore } from '@/entities/task';

export type DeleteBoardColumnProps = {
  boardId: string;
  columnId: string;
  deleteTasks: boolean;
  onStart?: () => void;
  onEnd?: () => void;
};

export const useDeleteBoardColumn = () => {
  const getSessionState = useSessionStore.use.getState();
  const canDeleteBoardColumn = useCanDeleteBoardColumnFn();
  const setTaskDeletionStoreState = useTaskDeletionStore.use.setState();
  const setBoardUpdateState = useBoardUpdateStore.use.setState();
  const setBoardUpdateCancelReqFn = useBoardUpdateStore.use.setCancelReqFn();
  const setTasksState = useTasksStore.use.setState();
  const { updateBoard } = useBoardsStoreActions();

  return useCallback(
    async ({ deleteTasks, onStart, onEnd, boardId, columnId }: DeleteBoardColumnProps) => {
      if (!canDeleteBoardColumn()) {
        return;
      }

      onStart?.();

      setBoardUpdateState({ isLoading: true, error: undefined });
      setTaskDeletionStoreState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setBoardUpdateCancelReqFn(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';

      const result = await boardApi.deleteBoardColumn({
        sessionId,
        boardId,
        columnId,
        signal: controller.signal,
        deleteTasks,
      });

      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          const { tasks, board } = result.data;
          setTasksState({ value: tasks });
          updateBoard(board);
        } else {
          setBoardUpdateState({ error: result.error });
        }
      }

      setTaskDeletionStoreState({ isLoading: false });
      setBoardUpdateState({ isLoading: false });
      onEnd?.();

      return isAborted ? undefined : result;
    },
    [
      canDeleteBoardColumn,
      getSessionState,
      setBoardUpdateCancelReqFn,
      setBoardUpdateState,
      setTaskDeletionStoreState,
      setTasksState,
      updateBoard,
    ]
  );
};
