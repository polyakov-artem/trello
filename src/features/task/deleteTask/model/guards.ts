import {
  useBoardDeletionStore,
  useBoardsIsLoading,
  useBoardsStore,
  useBoardUpdateStore,
} from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import { useTaskDeletionStore, useTasksStore, useTaskUpdateStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanDeleteTaskGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;

  isDeletingTask: boolean;
  isLoadingTasks: boolean;
  isUpdatingTask: boolean;

  isLoadingBoards: boolean;
  isUpdatingBoard: boolean;
  isDeletingBoard: boolean;
};

export const canDeleteTaskGuard = ({
  session,
  isLoadingSession,
  isDeletingTask,
  isLoadingTasks,
  isUpdatingTask,
  isLoadingBoards,
  isUpdatingBoard,
  isDeletingBoard,
}: CanDeleteTaskGuardProps) => {
  return (
    !!session &&
    !isLoadingSession &&
    !isDeletingTask &&
    !isLoadingTasks &&
    !isUpdatingTask &&
    !isLoadingBoards &&
    !isUpdatingBoard &&
    !isDeletingBoard
  );
};

export const useCanDeleteTaskFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getDeletionStoreState = useTaskDeletionStore.use.getState();
  const getTasksStoreState = useTasksStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();
  const getBoardDeletionState = useBoardDeletionStore.use.getState();
  const getBoardsState = useBoardsStore.getState;
  const getTaskUpdateStoreState = useTaskUpdateStore.use.getState();

  return useCallback(
    () =>
      canDeleteTaskGuard({
        session: getSessionStoreState().value,
        isLoadingSession: getSessionStoreState().isLoading,
        isDeletingTask: getDeletionStoreState().isLoading,
        isLoadingTasks: getTasksStoreState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
        isDeletingBoard: getBoardDeletionState().isLoading,
        isLoadingBoards: getBoardsState().isLoading,
        isUpdatingTask: getTaskUpdateStoreState().isLoading,
      }),
    [
      getBoardDeletionState,
      getBoardUpdateState,
      getBoardsState,
      getDeletionStoreState,
      getSessionStoreState,
      getTasksStoreState,
      getTaskUpdateStoreState,
    ]
  );
};

export const useCanDeleteTask = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isDeletingTask = useTaskDeletionStore.use.isLoading();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();
  const isLoadingBoards = useBoardsIsLoading();
  const isUpdatingTask = useTaskUpdateStore.use.isLoading();

  return useMemo(
    () =>
      canDeleteTaskGuard({
        session,
        isLoadingSession,
        isDeletingTask,
        isLoadingTasks,
        isUpdatingBoard,
        isDeletingBoard,
        isLoadingBoards,
        isUpdatingTask,
      }),
    [
      isDeletingBoard,
      isDeletingTask,
      isLoadingBoards,
      isLoadingSession,
      isLoadingTasks,
      isUpdatingTask,
      isUpdatingBoard,
      session,
    ]
  );
};
