import { useTasksStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';
import type { FetchResult } from '@/shared/lib/safeFetch';
import type { Task } from '@/entities/task';
import { useSessionStore } from '@/entities/session';

export const useLoadTasks = () => {
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const setTasksState = useTasksStore.use.setState();
  const checkIfLoadingTasks = useTasksStore.use.checkIfLoading();
  const setCancelTasksLoadingRef = useTasksStore.use.setCancelRef();

  const loadTasks = useCallback(
    async (signal?: AbortSignal): Promise<FetchResult<Task[]> | undefined> => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfLoadingTasks() || checkIfLoadingSession() || !sessionId) {
        return;
      }

      setTasksState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelTasksLoadingRef(() => controller.abort());

      const result = await taskApi.getTasks(sessionId, signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState({ value: result.data });
        } else {
          setTasksState({ error: result.error });
        }
      }

      setTasksState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [
      checkIfLoadingSession,
      checkIfLoadingTasks,
      getSession,
      setCancelTasksLoadingRef,
      setTasksState,
    ]
  );

  return { loadTasks };
};
