import { useBoardDeletionStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';

import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canDeleteBoardGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isDeletingBoard: boolean
) => {
  return !!session && !isDeletingBoard && !isLoadingSession;
};

export const useCanDeleteBoardFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getDeletionStoreState = useBoardDeletionStore.use.getState();

  return useCallback(
    () =>
      canDeleteBoardGuard(
        getSessionStoreState().value,
        getSessionStoreState().isLoading,
        getDeletionStoreState().isLoading
      ),
    [getDeletionStoreState, getSessionStoreState]
  );
};

export const useCanDeleteBoard = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();

  return useMemo(
    () => canDeleteBoardGuard(session, isLoadingSession, isDeletingBoard),
    [isDeletingBoard, isLoadingSession, session]
  );
};
