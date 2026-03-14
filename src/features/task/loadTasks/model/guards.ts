import { useSessionStore } from '@/entities/session';
import { useTasksStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canLoadTasksGuard = (session: Session | undefined, isLoadingTasks: boolean) => {
  return !!session && !isLoadingTasks;
};

export const useCanLoadTasks = () => {
  const session = useSessionStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();

  return useMemo(() => canLoadTasksGuard(session, isLoadingTasks), [isLoadingTasks, session]);
};

export const useCanLoadTasksFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getTaskStoreState = useTasksStore.use.getState();

  return useCallback(
    () => canLoadTasksGuard(getSessionStoreState().value, getTaskStoreState().isLoading),
    [getSessionStoreState, getTaskStoreState]
  );
};
