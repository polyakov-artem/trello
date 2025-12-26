import { useBoardDeletionStore, useBoardsIsLoading, useBoardsStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';

import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanDeleteBoardGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isDeletingBoard: boolean;
  isLoadingBoards: boolean;
};

export const canDeleteBoardGuard = ({
  session,
  isLoadingSession,
  isDeletingBoard,
  isLoadingBoards,
}: CanDeleteBoardGuardProps) => {
  return !!session && !isDeletingBoard && !isLoadingSession && !isLoadingBoards;
};

export const useCanDeleteBoardFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getDeletionStoreState = useBoardDeletionStore.use.getState();
  const getBoardsState = useBoardsStore.getState;

  return useCallback(
    () =>
      canDeleteBoardGuard({
        session: getSessionStoreState().value,
        isLoadingSession: getSessionStoreState().isLoading,
        isDeletingBoard: getDeletionStoreState().isLoading,
        isLoadingBoards: getBoardsState().isLoading,
      }),
    [getBoardsState, getDeletionStoreState, getSessionStoreState]
  );
};

export const useCanDeleteBoard = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();
  const isLoadingBoards = useBoardsIsLoading();

  return useMemo(
    () =>
      canDeleteBoardGuard({
        session,
        isLoadingSession,
        isDeletingBoard,
        isLoadingBoards,
      }),
    [isDeletingBoard, isLoadingBoards, isLoadingSession, session]
  );
};
