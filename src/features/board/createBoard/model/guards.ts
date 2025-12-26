import { useBoardCreationStore, useBoardsIsLoading, useBoardsStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanCreateBoardGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isCreatingBoard: boolean;
  isLoadingBoards: boolean;
};

export const canCreateBoardGuard = ({
  session,
  isLoadingSession,
  isCreatingBoard,
  isLoadingBoards,
}: CanCreateBoardGuardProps) => {
  return !!session && !isCreatingBoard && !isLoadingSession && !isLoadingBoards;
};

export const useCanCreateBoardFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardCreationState = useBoardCreationStore.use.getState();
  const getBoardsState = useBoardsStore.getState;

  return useCallback(
    () =>
      canCreateBoardGuard({
        session: getSessionState().value,
        isLoadingSession: getSessionState().isLoading,
        isCreatingBoard: getBoardCreationState().isLoading,
        isLoadingBoards: getBoardsState().isLoading,
      }),
    [getBoardCreationState, getBoardsState, getSessionState]
  );
};

export const useCanCreateBoard = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isCreatingBoard = useBoardCreationStore.use.isLoading();
  const isLoadingBoards = useBoardsIsLoading();

  return useMemo(
    () =>
      canCreateBoardGuard({
        session,
        isLoadingSession,
        isCreatingBoard,
        isLoadingBoards,
      }),
    [isCreatingBoard, isLoadingBoards, isLoadingSession, session]
  );
};
