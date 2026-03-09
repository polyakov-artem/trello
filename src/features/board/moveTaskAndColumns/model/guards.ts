import {
  useBoardDeletionStore,
  useBoardsIsLoading,
  useBoardsStore,
  useBoardUpdateStore,
} from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import { useTaskCreationStore, useTasksStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanMoveTaskOrColumnsGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isCreatingTask: boolean;
  isLoadingTasks: boolean;
  isUpdatingBoard: boolean;
  isDeletingBoard: boolean;
  isLoadingBoards: boolean;
};

export const canMoveTaskOrColumnsGuard = ({
  session,
  isLoadingSession,
  isCreatingTask,
  isLoadingTasks,
  isUpdatingBoard,
  isDeletingBoard,
  isLoadingBoards,
}: CanMoveTaskOrColumnsGuardProps) => {
  return (
    !!session &&
    !isLoadingSession &&
    !isCreatingTask &&
    !isLoadingTasks &&
    !isUpdatingBoard &&
    !isDeletingBoard &&
    !isLoadingBoards
  );
};

export const useCanMoveTaskOrColumnsFn = () => {
  const getTaskCreationState = useTaskCreationStore.use.getState();
  const getSessionState = useSessionStore.use.getState();
  const getTasksState = useTasksStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.getState;
  const getBoardDeletionState = useBoardDeletionStore.getState;
  const getBoardsState = useBoardsStore.getState;

  return useCallback(
    () =>
      canMoveTaskOrColumnsGuard({
        session: getSessionState().value,
        isLoadingSession: getSessionState().isLoading,
        isCreatingTask: getTaskCreationState().isLoading,
        isLoadingTasks: getTasksState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
        isDeletingBoard: getBoardDeletionState().isLoading,
        isLoadingBoards: getBoardsState().isLoading,
      }),
    [
      getBoardDeletionState,
      getBoardUpdateState,
      getBoardsState,
      getSessionState,
      getTaskCreationState,
      getTasksState,
    ]
  );
};

export const useCanMoveTaskOrColumns = () => {
  const isCreatingTask = useTaskCreationStore.use.isLoading();
  const isLoadingSession = useSessionStore.use.isLoading();
  const session = useSessionStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();

  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();
  const isLoadingBoards = useBoardsIsLoading();

  return useMemo(
    () =>
      canMoveTaskOrColumnsGuard({
        session,
        isLoadingSession,
        isCreatingTask,
        isLoadingTasks,
        isUpdatingBoard,
        isDeletingBoard,
        isLoadingBoards,
      }),
    [
      isDeletingBoard,
      isLoadingBoards,
      isLoadingSession,
      isCreatingTask,
      isLoadingTasks,
      isUpdatingBoard,
      session,
    ]
  );
};
