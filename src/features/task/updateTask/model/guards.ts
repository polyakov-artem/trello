import { useSessionStore } from '@/entities/session';
import { useTasksStore, useTaskUpdateStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canUpdateTasksGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isUpdatingTask: boolean,
  isLoadingTasks: boolean,
  taskId: string | undefined
) => {
  return !!session && !isLoadingSession && !isUpdatingTask && !isLoadingTasks && !!taskId;
};

export const useCanUpdateTask = (taskId?: string) => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isUpdatingTask = useTaskUpdateStore.use.isLoading();
  const isLoadingTasks = useTasksStore.use.isLoading();

  return useMemo(
    () => canUpdateTasksGuard(session, isLoadingSession, isUpdatingTask, isLoadingTasks, taskId),
    [isLoadingSession, isLoadingTasks, isUpdatingTask, session, taskId]
  );
};

export const useCanUpdateTaskFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getTaskUpdateStoreState = useTaskUpdateStore.use.getState();
  const getTasksStoreState = useTaskUpdateStore.use.getState();

  return useCallback(
    (taskId?: string) =>
      canUpdateTasksGuard(
        getSessionStoreState().value,
        getSessionStoreState().isLoading,
        getTaskUpdateStoreState().isLoading,
        getTasksStoreState().isLoading,
        taskId
      ),
    [getSessionStoreState, getTaskUpdateStoreState, getTasksStoreState]
  );
};
