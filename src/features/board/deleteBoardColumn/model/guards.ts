import { useBoardUpdateStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanDeleteBoardColumnGuardProps = {
  session: Session | undefined;
  isUpdatingBoard: boolean;
};

export const canDeleteBoardColumnGuard = (props: CanDeleteBoardColumnGuardProps) => {
  const { session, isUpdatingBoard } = props;

  return !!session && !isUpdatingBoard;
};

export const useCanDeleteBoardColumn = () => {
  const session = useSessionStore.use.value();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();

  return useMemo(
    () =>
      canDeleteBoardColumnGuard({
        session,
        isUpdatingBoard,
      }),
    [isUpdatingBoard, session]
  );
};

export const useCanDeleteBoardColumnFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();

  return useCallback(
    () =>
      canDeleteBoardColumnGuard({
        session: getSessionState().value,
        isUpdatingBoard: getBoardUpdateState().isLoading,
      }),
    [getSessionState, getBoardUpdateState]
  );
};
