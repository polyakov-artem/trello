import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canLoadBoardsGuard = (session: Session | undefined, isLoadingBoards: boolean) => {
  return !!session && !isLoadingBoards;
};

export const useCanLoadBoards = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();

  return useMemo(() => canLoadBoardsGuard(session, isLoadingSession), [isLoadingSession, session]);
};

export const useCanLoadBoardsFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();

  return useCallback(
    () => canLoadBoardsGuard(getSessionStoreState().value, getSessionStoreState().isLoading),
    [getSessionStoreState]
  );
};
