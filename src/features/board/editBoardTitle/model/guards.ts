import { useBoardUpdateStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanUpdateBoardTitleGuardProps = {
  session: Session | undefined;
  isUpdatingBoard: boolean;
};

export const canUpdateBoardTitleGuard = (props: CanUpdateBoardTitleGuardProps) => {
  const { session, isUpdatingBoard } = props;

  return !!session && !isUpdatingBoard;
};

export const useCanUpdateBoardTitle = () => {
  const session = useSessionStore.use.value();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();

  return useMemo(
    () =>
      canUpdateBoardTitleGuard({
        session,
        isUpdatingBoard,
      }),
    [isUpdatingBoard, session]
  );
};

export const useCanUpdateBoardTitleFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();

  return useCallback(
    () =>
      canUpdateBoardTitleGuard({
        session: getSessionState().value,
        isUpdatingBoard: getBoardUpdateState().isLoading,
      }),
    [getSessionState, getBoardUpdateState]
  );
};
