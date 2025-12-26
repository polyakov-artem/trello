import { useSessionStore } from '@/entities/session';
import { useCallback } from 'react';
import { useCanCreateTaskFn } from './guards';
import type { TaskDraft } from '@/shared/types/types';
import { useTaskCreationStore, useTasksStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';

export type CreateTaskProps = {
  taskDraft: TaskDraft;
  onStart?: () => void;
  onEnd?: () => void;
};

export const useCreateTask = () => {
  const getSessionState = useSessionStore.use.getState();
  const canCreateTask = useCanCreateTaskFn();

  const setCancelReqFn = useTaskCreationStore.use.setCancelReqFn();
  const setTaskCreationState = useTaskCreationStore.use.setState();
  const setTasksState = useTasksStore.use.setState();

  return useCallback(
    async ({ taskDraft, onStart, onEnd }: CreateTaskProps) => {
      if (!canCreateTask()) {
        return;
      }

      onStart?.();

      setTaskCreationState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelReqFn(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';
      const result = await taskApi.createTask(sessionId, taskDraft, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState(({ value: prevTasks }) => {
            return { value: prevTasks ? [...prevTasks, result.data] : [result.data] };
          });
        } else {
          setTaskCreationState({ error: result.error });
        }
      }

      setTaskCreationState({ isLoading: false });
      onEnd?.();

      return isAborted ? undefined : result;
    },
    [canCreateTask, getSessionState, setCancelReqFn, setTaskCreationState, setTasksState]
  );
};
