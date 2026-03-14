import { useBoardDeletionStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';

import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanDeleteBoardGuardProps = {
  session: Session | undefined;
  isDeletingBoard: boolean;
};

export const canDeleteBoardGuard = ({ session, isDeletingBoard }: CanDeleteBoardGuardProps) => {
  return !!session && !isDeletingBoard;
};

export const useCanDeleteBoardFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getDeletionStoreState = useBoardDeletionStore.use.getState();

  return useCallback(
    () =>
      canDeleteBoardGuard({
        session: getSessionStoreState().value,
        isDeletingBoard: getDeletionStoreState().isLoading,
      }),
    [getDeletionStoreState, getSessionStoreState]
  );
};

export const useCanDeleteBoard = () => {
  const session = useSessionStore.use.value();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();

  return useMemo(
    () =>
      canDeleteBoardGuard({
        session,
        isDeletingBoard,
      }),
    [isDeletingBoard, session]
  );
};
