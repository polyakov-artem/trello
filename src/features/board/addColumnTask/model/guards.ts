import { useBoardDeletionStore, useBoardsStore, useBoardUpdateStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import { useTaskCreationStore, useTasksStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type canAddColumnTaskGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isLoadingBoards: boolean;
  isLoadingTasks: boolean;
  isUpdatingBoard: boolean;
  isDeletingBoard: boolean;
  isCreatingTask: boolean;
};

export const canAddColumnTask = (props: canAddColumnTaskGuardProps) => {
  const {
    session,
    isLoadingSession,
    isUpdatingBoard,
    isDeletingBoard,
    isLoadingBoards,
    isLoadingTasks,
    isCreatingTask,
  } = props;
  return (
    !!session &&
    !isLoadingSession &&
    !isUpdatingBoard &&
    !isDeletingBoard &&
    !isLoadingBoards &&
    !isLoadingTasks &&
    !isCreatingTask
  );
};

export const useCanAddColumnTask = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();
  const isLoadingBoards = useBoardsStore.use.isLoading();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const isCreatingTask = useTaskCreationStore.use.isLoading();

  return useMemo(
    () =>
      canAddColumnTask({
        session,
        isLoadingSession,
        isUpdatingBoard,
        isDeletingBoard,
        isLoadingBoards,
        isLoadingTasks,
        isCreatingTask,
      }),
    [
      isCreatingTask,
      isDeletingBoard,
      isLoadingBoards,
      isLoadingSession,
      isLoadingTasks,
      isUpdatingBoard,
      session,
    ]
  );
};
export const useCanAddColumnTaskFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();
  const getBoardDeletionState = useBoardDeletionStore.use.getState();
  const getBoardsState = useBoardsStore.use.getState();
  const getTasksStoreState = useTasksStore.use.getState();
  const getTaskCreationStoreState = useTaskCreationStore.use.getState();

  return useCallback(
    () =>
      canAddColumnTask({
        session: getSessionState().value,
        isLoadingSession: getSessionState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
        isDeletingBoard: getBoardDeletionState().isLoading,
        isLoadingBoards: getBoardsState().isLoading,
        isLoadingTasks: getTasksStoreState().isLoading,
        isCreatingTask: getTaskCreationStoreState().isLoading,
      }),
    [
      getBoardDeletionState,
      getBoardUpdateState,
      getBoardsState,
      getSessionState,
      getTaskCreationStoreState,
      getTasksStoreState,
    ]
  );
};
