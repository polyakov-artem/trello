import { useSessionStore } from '@/entities/session';
import { useTasksStore, useTaskUpdateStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';
import { useCanUpdateTaskFn } from './guards';
import type { TaskDraft } from '@/shared/types/types';

export const useUpdateTask = () => {
  const canUpdateTasksFn = useCanUpdateTaskFn();
  const getSessionState = useSessionStore.use.getState();

  const setCancelRef = useTaskUpdateStore.use.setCancelReqFn();
  const setTaskUpdatingState = useTaskUpdateStore.use.setState();

  const setTasksState = useTasksStore.use.setState();

  const updateTask = useCallback(
    async (taskId: string, task: TaskDraft, onStart?: () => void) => {
      if (!canUpdateTasksFn()) {
        return;
      }

      onStart?.();

      setTaskUpdatingState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';
      const result = await taskApi.updateTask(sessionId, taskId, task, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState((prevState) => {
            return {
              value: prevState.value?.map((task) => {
                if (task.id === taskId) {
                  return result.data;
                }

                return task;
              }),
            };
          });
        } else {
          setTaskUpdatingState({ error: result.error });
        }
      }

      setTaskUpdatingState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [canUpdateTasksFn, getSessionState, setCancelRef, setTaskUpdatingState, setTasksState]
  );

  return updateTask;
};
