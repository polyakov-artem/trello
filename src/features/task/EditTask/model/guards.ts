import { useSessionStore } from '@/entities/session';
import { useTasksStore, useTaskUpdateStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';
import { useTaskDeletionStore } from '../../../../entities/task/model/tasksStore';

export type CanUpdateTaskGuard = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isUpdatingTask: boolean;
  isLoadingTasks: boolean;
  isDeletingTask: boolean;
};

export const canUpdateTaskGuard = ({
  session,
  isLoadingSession,
  isUpdatingTask,
  isLoadingTasks,
  isDeletingTask,
}: CanUpdateTaskGuard) => {
  return !!session && !isLoadingSession && !isUpdatingTask && !isLoadingTasks && !isDeletingTask;
};

export const useCanUpdateTask = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isUpdatingTask = useTaskUpdateStore.use.isLoading();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const isDeletingTask = useTaskDeletionStore.use.isLoading();

  return useMemo(
    () =>
      canUpdateTaskGuard({
        session,
        isLoadingSession,
        isUpdatingTask,
        isLoadingTasks,
        isDeletingTask,
      }),
    [isDeletingTask, isLoadingSession, isLoadingTasks, isUpdatingTask, session]
  );
};

export const useCanUpdateTaskFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getTaskUpdateStoreState = useTaskUpdateStore.use.getState();
  const getTasksStoreState = useTaskUpdateStore.use.getState();
  const getTaskDeletingStoreState = useTaskDeletionStore.use.getState();

  return useCallback(
    () =>
      canUpdateTaskGuard({
        session: getSessionStoreState().value,
        isLoadingSession: getSessionStoreState().isLoading,
        isUpdatingTask: getTaskUpdateStoreState().isLoading,
        isLoadingTasks: getTasksStoreState().isLoading,
        isDeletingTask: getTaskDeletingStoreState().isLoading,
      }),
    [getSessionStoreState, getTaskDeletingStoreState, getTaskUpdateStoreState, getTasksStoreState]
  );
};
