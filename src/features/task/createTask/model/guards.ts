import { useSessionStore } from '@/entities/session';
import { useTaskCreationStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canCreateTaskGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isCreatingTask: boolean
) => {
  return !!session && !isLoadingSession && !isCreatingTask;
};

export const useCanCreateTaskFn = () => {
  const getTaskCreationState = useTaskCreationStore.use.getState();
  const getSessionState = useSessionStore.use.getState();

  return useCallback(
    () =>
      canCreateTaskGuard(
        getSessionState().value,
        getSessionState().isLoading,
        getTaskCreationState().isLoading
      ),
    [getSessionState, getTaskCreationState]
  );
};

export const useCanCreateTask = () => {
  const isCreatingTask = useTaskCreationStore.use.isLoading();
  const isLoadingSession = useSessionStore.use.isLoading();
  const session = useSessionStore.use.value();

  return useMemo(
    () => canCreateTaskGuard(session, isLoadingSession, isCreatingTask),
    [isCreatingTask, isLoadingSession, session]
  );
};
