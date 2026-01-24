import { useTaskCreationStore, useTasksStore } from '@/entities/task';
import { taskApi } from '@/shared/api/task/taskApi';
import type { TaskDraft } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';

export const useCreateTaskFx = () => {
  const setCancelRef = useTaskCreationStore.use.setCancelRef();
  const setTaskCreationState = useTaskCreationStore.use.setState();
  const setTasksState = useTasksStore.use.setState();

  return useCallback(
    async (sessionId: string, task: TaskDraft) => {
      setTaskCreationState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

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
    [setCancelRef, setTaskCreationState, setTasksState]
  );
};
