import { useTasksStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';
import type { FetchResult } from '@/shared/lib/safeFetch';
import type { Task } from '@/shared/types/types';
import { useSessionStore } from '@/entities/session';
import { useCanLoadTasksFn } from './guards';

export const useLoadTasks = () => {
  const canLoadTasksFn = useCanLoadTasksFn();
  const getSessionState = useSessionStore.use.getState();

  const setTasksState = useTasksStore.use.setState();
  const setCancelTasksLoadingRef = useTasksStore.use.setCancelReqFn();

  const loadTasks = useCallback(
    async (signal?: AbortSignal): Promise<FetchResult<Task[]> | undefined> => {
      if (!canLoadTasksFn()) {
        return;
      }

      setTasksState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelTasksLoadingRef(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';

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
    [canLoadTasksFn, getSessionState, setCancelTasksLoadingRef, setTasksState]
  );

  return loadTasks;
};
