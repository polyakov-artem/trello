import { useBoardsIsLoading, useBoardsStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canLoadBoardsGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isLoadingBoards: boolean
) => {
  return !!session && !isLoadingSession && !isLoadingBoards;
};

export const useCanLoadBoards = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isLoadingBoards = useBoardsIsLoading();

  return useMemo(
    () => canLoadBoardsGuard(session, isLoadingSession, isLoadingBoards),
    [isLoadingSession, isLoadingBoards, session]
  );
};

export const useCanLoadBoardsFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getBoardStoreState = useBoardsStore.getState;

  return useCallback(
    () =>
      canLoadBoardsGuard(
        getSessionStoreState().value,
        getSessionStoreState().isLoading,
        getBoardStoreState().isLoading
      ),
    [getSessionStoreState, getBoardStoreState]
  );
};
