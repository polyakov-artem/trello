import { useSessionStore } from '@/entities/session';
import { useTasksStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canLoadTasksGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isLoadingTasks: boolean
) => {
  return !!session && !isLoadingSession && !isLoadingTasks;
};

export const useCanLoadTasks = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isLoadingTasks = useTasksStore.use.isLoading();

  return useMemo(
    () => canLoadTasksGuard(session, isLoadingSession, isLoadingTasks),
    [isLoadingSession, isLoadingTasks, session]
  );
};

export const useCanLoadTasksFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getTaskStoreState = useTasksStore.use.getState();

  return useCallback(
    () =>
      canLoadTasksGuard(
        getSessionStoreState().value,
        getSessionStoreState().isLoading,
        getTaskStoreState().isLoading
      ),
    [getSessionStoreState, getTaskStoreState]
  );
};
