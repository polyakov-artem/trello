import { useBoardUpdateStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import { useTaskCreationStore, useTaskDeletionStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanMoveTaskOrColumnsGuardProps = {
  session: Session | undefined;
  isCreatingTask: boolean;
  isDeletingTask: boolean;
  isUpdatingBoard: boolean;
};

export const canMoveTaskOrColumnsGuard = ({
  session,
  isCreatingTask,
  isUpdatingBoard,
  isDeletingTask,
}: CanMoveTaskOrColumnsGuardProps) => {
  return !!session && !isCreatingTask && !isUpdatingBoard && !isDeletingTask;
};

export const useCanMoveTaskOrColumnsFn = () => {
  const getTaskCreationState = useTaskCreationStore.use.getState();
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.getState;
  const getTaskDeletionState = useTaskDeletionStore.getState;

  return useCallback(
    () =>
      canMoveTaskOrColumnsGuard({
        session: getSessionState().value,
        isCreatingTask: getTaskCreationState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
        isDeletingTask: getTaskDeletionState().isLoading,
      }),
    [getBoardUpdateState, getSessionState, getTaskCreationState, getTaskDeletionState]
  );
};

export const useCanMoveTaskOrColumns = () => {
  const isCreatingTask = useTaskCreationStore.use.isLoading();
  const session = useSessionStore.use.value();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();
  const isDeletingTask = useTaskDeletionStore.use.isLoading();

  return useMemo(
    () =>
      canMoveTaskOrColumnsGuard({
        session,
        isCreatingTask,
        isUpdatingBoard,
        isDeletingTask,
      }),
    [session, isCreatingTask, isUpdatingBoard, isDeletingTask]
  );
};
