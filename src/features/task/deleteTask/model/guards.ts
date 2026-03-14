import { useBoardUpdateStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import { useTaskDeletionStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanDeleteTaskGuardProps = {
  session: Session | undefined;
  isDeletingTask: boolean;
  isUpdatingBoard: boolean;
};

export const canDeleteTaskGuard = ({
  session,
  isDeletingTask,
  isUpdatingBoard,
}: CanDeleteTaskGuardProps) => {
  return !!session && !isDeletingTask && !isUpdatingBoard;
};

export const useCanDeleteTaskFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getDeletionStoreState = useTaskDeletionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();

  return useCallback(
    () =>
      canDeleteTaskGuard({
        session: getSessionStoreState().value,
        isDeletingTask: getDeletionStoreState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
      }),
    [getBoardUpdateState, getDeletionStoreState, getSessionStoreState]
  );
};

export const useCanDeleteTask = () => {
  const session = useSessionStore.use.value();
  const isDeletingTask = useTaskDeletionStore.use.isLoading();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();

  return useMemo(
    () =>
      canDeleteTaskGuard({
        session,
        isDeletingTask,
        isUpdatingBoard,
      }),
    [isDeletingTask, isUpdatingBoard, session]
  );
};
