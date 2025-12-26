import { useSessionStore } from '@/entities/session';
import { useTaskDeletionStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canDeleteTaskGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isDeletingTask: boolean
) => {
  return !!session && !isDeletingTask && !isLoadingSession;
};

export const useCanDeleteTaskFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getDeletionStoreState = useTaskDeletionStore.use.getState();

  return useCallback(
    () =>
      canDeleteTaskGuard(
        getSessionStoreState().value,
        getSessionStoreState().isLoading,
        getDeletionStoreState().isLoading
      ),
    [getDeletionStoreState, getSessionStoreState]
  );
};

export const useCanDeleteTask = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isDeletingTask = useTaskDeletionStore.use.isLoading();

  return useMemo(
    () => canDeleteTaskGuard(session, isLoadingSession, isDeletingTask),
    [isDeletingTask, isLoadingSession, session]
  );
};
