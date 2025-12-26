import { useBoardCreationStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canCreateBoardGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isCreatingBoard: boolean
) => {
  return !!session && !isCreatingBoard && !isLoadingSession;
};

export const useCanCreateBoardFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardCreationState = useBoardCreationStore.use.getState();

  return useCallback(
    () =>
      canCreateBoardGuard(
        getSessionState().value,
        getSessionState().isLoading,
        getBoardCreationState().isLoading
      ),
    [getBoardCreationState, getSessionState]
  );
};

export const useCanCreateBoard = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isCreatingBoard = useBoardCreationStore.use.isLoading();

  return useMemo(
    () => canCreateBoardGuard(session, isLoadingSession, isCreatingBoard),
    [isCreatingBoard, isLoadingSession, session]
  );
};
