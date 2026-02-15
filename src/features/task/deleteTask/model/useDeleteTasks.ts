import { useSessionStore } from '@/entities/session';
import { useTasksStore, useTaskDeletionStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';
import { useCanDeleteTaskFn } from './guards';
import { useBoardsStoreActions } from '@/entities/board';

export const useDeleteTasks = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const canDeleteTaskFn = useCanDeleteTaskFn();
  const setCancelRef = useTaskDeletionStore.use.setCancelReqFn();
  const setTaskDeletionState = useTaskDeletionStore.use.setState();
  const { removeTasks } = useBoardsStoreActions();
  const setTasksState = useTasksStore.use.setState();

  return useCallback(
    async (value: string[] | string, onStart?: () => void, onEnd?: () => void) => {
      const taskIds = Array.isArray(value) ? value : [value];
      console.log('taskIds', taskIds);

      if (!canDeleteTaskFn() || !taskIds.length) {
        return;
      }

      onStart?.();

      setTaskDeletionState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionStoreState().value?.sessionId || '';

      const result = await taskApi.deleteTasks(sessionId, taskIds, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState((prevState) => {
            return {
              value: prevState.value?.filter((task) => !taskIds.includes(task.id)),
            };
          });

          removeTasks(taskIds);
        }
      }

      setTaskDeletionState({ isLoading: false });

      onEnd?.();
      return isAborted ? undefined : result;
    },
    [
      canDeleteTaskFn,
      getSessionStoreState,
      removeTasks,
      setCancelRef,
      setTaskDeletionState,
      setTasksState,
    ]
  );
};
