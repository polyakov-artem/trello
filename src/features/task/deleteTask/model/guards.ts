import { useSessionStore } from '@/entities/session';
import { useTaskDeletionStore, useTasksStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanDeleteTaskGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isDeletingTask: boolean;
  isLoadingTasks: boolean;
};

export const canDeleteTaskGuard = ({
  session,
  isLoadingSession,
  isDeletingTask,
  isLoadingTasks,
}: CanDeleteTaskGuardProps) => {
  return !!session && !isDeletingTask && !isLoadingSession && !isLoadingTasks;
};

export const useCanDeleteTaskFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getDeletionStoreState = useTaskDeletionStore.use.getState();
  const getTasksStoreState = useTasksStore.use.getState();

  return useCallback(
    () =>
      canDeleteTaskGuard({
        session: getSessionStoreState().value,
        isLoadingSession: getSessionStoreState().isLoading,
        isDeletingTask: getDeletionStoreState().isLoading,
        isLoadingTasks: getTasksStoreState().isLoading,
      }),
    [getDeletionStoreState, getSessionStoreState, getTasksStoreState]
  );
};

export const useCanDeleteTask = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isDeletingTask = useTaskDeletionStore.use.isLoading();
  const isLoadingTasks = useTasksStore.use.isLoading();

  return useMemo(
    () =>
      canDeleteTaskGuard({
        session,
        isLoadingSession,
        isDeletingTask,
        isLoadingTasks,
      }),
    [isDeletingTask, isLoadingSession, isLoadingTasks, session]
  );
};
