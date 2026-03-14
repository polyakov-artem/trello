import { useBoardUpdateStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import { useTaskCreationStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanCreateColumnTaskGuardProps = {
  session: Session | undefined;
  isCreatingTask: boolean;
  isUpdatingBoard: boolean;
};

export const canCreateColumnTaskGuard = ({
  session,
  isCreatingTask,
  isUpdatingBoard,
}: CanCreateColumnTaskGuardProps) => {
  return !!session && !isCreatingTask && !isUpdatingBoard;
};

export const useCanCreateColumnTaskFn = () => {
  const getTaskCreationState = useTaskCreationStore.use.getState();
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.getState;

  return useCallback(
    () =>
      canCreateColumnTaskGuard({
        session: getSessionState().value,
        isCreatingTask: getTaskCreationState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
      }),
    [getBoardUpdateState, getSessionState, getTaskCreationState]
  );
};

export const useCanCreateColumnTask = () => {
  const isCreatingTask = useTaskCreationStore.use.isLoading();
  const session = useSessionStore.use.value();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();

  return useMemo(
    () =>
      canCreateColumnTaskGuard({
        session,
        isCreatingTask,
        isUpdatingBoard,
      }),
    [isCreatingTask, isUpdatingBoard, session]
  );
};
