import { useSessionStore } from '@/entities/session';
import { useTaskCreationStore, useTasksStore } from '@/entities/task';
import { taskApi, type NewTask } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';

export const useCreateTask = () => {
  const checkIfCreatingTask = useTasksStore.use.checkIfLoading();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const setCancelRef = useTaskCreationStore.use.setCancelRef();
  const setTaskCreationState = useTaskCreationStore.use.setState();

  const setTasksState = useTasksStore.use.setState();

  const createTask = useCallback(
    async (task: NewTask) => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfCreatingTask() || checkIfLoadingSession() || !sessionId) {
        return;
      }

      setTaskCreationState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const result = await taskApi.createTask(sessionId, task, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setTasksState((prevState) => {
            return { value: [...prevState.value, result.data] };
          });
        } else {
          setTaskCreationState({ error: result.error });
        }
      }

      setTaskCreationState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [
      checkIfCreatingTask,
      checkIfLoadingSession,
      getSession,
      setCancelRef,
      setTaskCreationState,
      setTasksState,
    ]
  );

  return {
    createTask,
  };
};
