import { useSessionStore } from '@/entities/session';
import { useTasksStore, useTaskUpdateStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import type { TaskDraft } from '@/entities/task';
import { useCallback } from 'react';

export const useUpdateTask = () => {
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const checkIfUpdatingTask = useTaskUpdateStore.use.checkIfLoading();
  const setCancelRef = useTaskUpdateStore.use.setCancelRef();
  const setTaskUpdatingState = useTaskUpdateStore.use.setState();

  const setTasksState = useTasksStore.use.setState();

  const updateTask = useCallback(
    async (taskId: string, task: TaskDraft) => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfUpdatingTask() || checkIfLoadingSession() || !sessionId) {
        return;
      }

      setTaskUpdatingState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const result = await taskApi.updateTask(sessionId, taskId, task, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState((prevState) => {
            return {
              value: prevState.value.map((task) => {
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
    [
      checkIfLoadingSession,
      checkIfUpdatingTask,
      getSession,
      setCancelRef,
      setTaskUpdatingState,
      setTasksState,
    ]
  );

  return {
    updateTask,
  };
};
