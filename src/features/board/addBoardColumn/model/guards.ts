import { useBoardUpdateStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type canAddBoardColumnGuardProps = {
  session: Session | undefined;
  isUpdatingBoard: boolean;
};

export const canAddBoardColumn = (props: canAddBoardColumnGuardProps) => {
  const { session, isUpdatingBoard } = props;
  return !!session && !isUpdatingBoard;
};

export const useCanAddBoardColumn = () => {
  const session = useSessionStore.use.value();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();

  return useMemo(
    () =>
      canAddBoardColumn({
        session,
        isUpdatingBoard,
      }),
    [isUpdatingBoard, session]
  );
};
export const useCanAddBoardColumnFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();

  return useCallback(
    () =>
      canAddBoardColumn({
        session: getSessionState().value,
        isUpdatingBoard: getBoardUpdateState().isLoading,
      }),
    [getBoardUpdateState, getSessionState]
  );
};
