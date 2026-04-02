import { taskApi } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';
import type { Task, TaskDraft } from '@/shared/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCanEditTask } from './guards';
import { authStore, useSessionId } from '@/entities/session';
import { mutationKeys, queryKeys } from '@/shared/config/queries';

export const useEditTask = (taskId: string) => {
  const canEditTask = useCanEditTask(taskId);
  const queryClient = useQueryClient();
  const sessionId = useSessionId();
  const queryKey = queryKeys.tasks({ sessionId });
  const getAuthStoreState = authStore.getState;

  const { isPending: isUpdatingTask, mutateAsync } = useMutation({
    mutationKey: mutationKeys.updateTask({ taskId, sessionId }),
    mutationFn: async ({ taskDraft }: { taskDraft: TaskDraft }) => {
      await taskApi.updateTask({
        sessionId,
        taskId,
        taskDraft,
      });
    },

    onMutate: async ({ taskDraft }) => {
      await queryClient.cancelQueries({ queryKey });

      const prevTasks = queryClient.getQueryData<Task[]>(queryKey);

      let prevTask: Task | undefined;

      queryClient.setQueryData(
        queryKey,
        prevTasks?.map((task) => {
          if (task.id === taskId) {
            prevTask = task;
            return { ...task, ...taskDraft };
          }
          return task;
        })
      );

      return prevTask;
    },

    onError: (_error, _variables, prevTask) => {
      const { sessionId: currentSessionId } = getAuthStoreState();
      if (currentSessionId !== sessionId || !prevTask) {
        return;
      }

      const tasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData(
        queryKey,
        tasks?.map((task) => {
          return task.id === taskId ? prevTask : task;
        })
      );
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateTask = useCallback(
    async (taskDraft: TaskDraft) => {
      if (!canEditTask) {
        return;
      }

      return await mutateAsync({ taskDraft });
    },
    [canEditTask, mutateAsync]
  );

  return {
    isUpdatingTask,
    updateTask,
    canEditTask,
  };
};
