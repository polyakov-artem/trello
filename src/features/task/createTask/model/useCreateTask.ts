import { useSessionStore } from '@/entities/session';
import { useTaskCreationStore, useTasksStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import type { TaskDraft } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';
import { useCanCreateTaskFn } from './guards';

export const useCreateTask = () => {
  const getSessionState = useSessionStore.use.getState();
  const canCreateTask = useCanCreateTaskFn();

  const setCancelRef = useTaskCreationStore.use.setCancelRef();
  const setTaskCreationState = useTaskCreationStore.use.setState();

  const setTasksState = useTasksStore.use.setState();

  const createTask = useCallback(
    async (task: TaskDraft, onStart?: () => void) => {
      if (!canCreateTask()) {
        return;
      }

      onStart?.();

      setTaskCreationState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';
      const result = await taskApi.createTask(sessionId, task, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState((prevState) => {
            return { value: [...(prevState.value || []), result.data] };
          });
        } else {
          setTaskCreationState({ error: result.error });
        }
      }

      setTaskCreationState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [canCreateTask, getSessionState, setCancelRef, setTaskCreationState, setTasksState]
  );

  return createTask;
};
