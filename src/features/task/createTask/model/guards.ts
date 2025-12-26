import { useSessionStore } from '@/entities/session';
import { useTaskCreationStore, useTasksStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanCreateTaskGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isCreatingTask: boolean;
  isLoadingTasks: boolean;
};

export const canCreateTaskGuard = ({
  session,
  isLoadingSession,
  isCreatingTask,
  isLoadingTasks,
}: CanCreateTaskGuardProps) => {
  return !!session && !isLoadingSession && !isCreatingTask && !isLoadingTasks;
};

export const useCanCreateTaskFn = () => {
  const getTaskCreationState = useTaskCreationStore.use.getState();
  const getSessionState = useSessionStore.use.getState();
  const getTasksState = useTasksStore.use.getState();

  return useCallback(
    () =>
      canCreateTaskGuard({
        session: getSessionState().value,
        isLoadingSession: getSessionState().isLoading,
        isCreatingTask: getTaskCreationState().isLoading,
        isLoadingTasks: getTasksState().isLoading,
      }),
    [getSessionState, getTaskCreationState, getTasksState]
  );
};

export const useCanCreateTask = () => {
  const isCreatingTask = useTaskCreationStore.use.isLoading();
  const isLoadingSession = useSessionStore.use.isLoading();
  const session = useSessionStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();

  return useMemo(
    () =>
      canCreateTaskGuard({
        session,
        isLoadingSession,
        isCreatingTask,
        isLoadingTasks,
      }),
    [isCreatingTask, isLoadingSession, isLoadingTasks, session]
  );
};
