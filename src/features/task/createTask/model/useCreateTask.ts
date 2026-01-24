import { useSessionStore } from '@/entities/session';
import { useCreateTaskFx } from '@/entities/task';
import type { TaskDraft } from '@/shared/api/task/taskApi';
import { useCallback } from 'react';
import { useCanCreateTaskFn } from './guards';

export const useCreateTask = () => {
  const getSessionState = useSessionStore.use.getState();
  const canCreateTask = useCanCreateTaskFn();
  const createTaskFx = useCreateTaskFx();

  return useCallback(
    async (task: TaskDraft, onStart?: () => void, onEnd?: () => void) => {
      if (!canCreateTask()) {
        return;
      }

      onStart?.();

      const sessionId = getSessionState().value?.sessionId || '';
      const result = await createTaskFx(sessionId, task);

      onEnd?.();
      return result;
    },
    [canCreateTask, createTaskFx, getSessionState]
  );
};
