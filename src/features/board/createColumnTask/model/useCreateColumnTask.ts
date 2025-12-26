import { useSessionStore } from '@/entities/session';
import { useCallback } from 'react';
import { useCanCreateColumnTaskFn } from './guards';
import type { TaskDraft } from '@/shared/types/types';
import { useTaskCreationStore, useTasksStore } from '@/entities/task';
import { boardApi } from '@/shared/api/board/boardApi';
import { useBoardsStoreActions, useBoardUpdateStore } from '@/entities/board';

export type CreateColumnTaskProps = {
  boardId: string;
  columnId: string;
  taskDraft: TaskDraft;
  onStart?: () => void;
  onEnd?: () => void;
};

export const useCreateColumnTask = () => {
  const getSessionState = useSessionStore.use.getState();
  const canCreateColumnTask = useCanCreateColumnTaskFn();

  const setCancelReqFn = useTaskCreationStore.use.setCancelReqFn();
  const setTaskCreationState = useTaskCreationStore.use.setState();
  const setBoardUpdateState = useBoardUpdateStore.use.setState();
  const setTasksState = useTasksStore.use.setState();
  const { updateBoard } = useBoardsStoreActions();

  return useCallback(
    async ({ taskDraft, onStart, onEnd, boardId, columnId }: CreateColumnTaskProps) => {
      if (!canCreateColumnTask()) {
        return;
      }

      onStart?.();

      setTaskCreationState({ isLoading: true, error: undefined });
      setBoardUpdateState({ isLoading: true });

      const controller = new AbortController();
      setCancelReqFn(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';

      const result = await boardApi.createColumnTask({
        sessionId,
        taskDraft,
        signal: controller.signal,
        boardId,
        columnId,
      });
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          const { task, board } = result.data;

          setTasksState(({ value: prevTasks }) => {
            return { value: prevTasks ? [...prevTasks, task] : [task] };
          });

          updateBoard(board);
        } else {
          setTaskCreationState({ error: result.error });
        }
      }

      setTaskCreationState({ isLoading: false });
      setBoardUpdateState({ isLoading: false });
      onEnd?.();

      return isAborted ? undefined : result;
    },
    [
      canCreateColumnTask,
      getSessionState,
      setBoardUpdateState,
      setCancelReqFn,
      setTaskCreationState,
      setTasksState,
      updateBoard,
    ]
  );
};
