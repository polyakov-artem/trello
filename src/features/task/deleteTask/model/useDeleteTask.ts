import { useSessionStore } from '@/entities/session';
import { useTasksStore, useTaskDeletionStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';
import { useCanDeleteTaskFn } from './guards';

export const useDeleteTask = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const canDeleteTaskFn = useCanDeleteTaskFn();
  const setCancelRef = useTaskDeletionStore.use.setCancelReqFn();
  const setTaskDeletionState = useTaskDeletionStore.use.setState();

  const setTasksState = useTasksStore.use.setState();

  const deleteTask = useCallback(
    async (taskId: string, onStart?: () => void, onEnd?: () => void) => {
      if (!canDeleteTaskFn()) {
        return;
      }

      onStart?.();

      setTaskDeletionState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionStoreState().value?.sessionId || '';

      const result = await taskApi.deleteTask(sessionId, taskId, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState((prevState) => {
            return {
              value: prevState.value?.filter((task) => task.id !== taskId),
            };
          });
        } else {
          setTaskDeletionState({ error: result.error });
        }
      }

      setTaskDeletionState({ isLoading: false });

      onEnd?.();
      return isAborted ? undefined : result;
    },
    [canDeleteTaskFn, getSessionStoreState, setCancelRef, setTaskDeletionState, setTasksState]
  );

  return deleteTask;
};
