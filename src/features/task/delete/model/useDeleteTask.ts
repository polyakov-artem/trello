import { useSessionStore } from '@/entities/session';
import { useTasksStore, useTaskDeletionStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';

export const useDeleteTask = () => {
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const checkIfDeletingTask = useTaskDeletionStore.use.checkIfLoading();
  const setCancelRef = useTaskDeletionStore.use.setCancelRef();
  const setTaskDeletionState = useTaskDeletionStore.use.setState();

  const setTasksState = useTasksStore.use.setState();

  const deleteTask = useCallback(
    async (taskId: string) => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfDeletingTask() || checkIfLoadingSession() || !sessionId) {
        return;
      }

      setTaskDeletionState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const result = await taskApi.deleteTask(sessionId, taskId, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState((prevState) => {
            return {
              value: prevState.value.filter((task) => task.id !== taskId),
            };
          });
        } else {
          setTaskDeletionState({ error: result.error });
        }
      }

      setTaskDeletionState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [
      checkIfDeletingTask,
      checkIfLoadingSession,
      getSession,
      setCancelRef,
      setTaskDeletionState,
      setTasksState,
    ]
  );

  return deleteTask;
};
