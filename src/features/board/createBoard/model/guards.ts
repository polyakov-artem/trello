import { useBoardCreationStore } from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanCreateBoardGuardProps = {
  session: Session | undefined;
  isCreatingBoard: boolean;
};

export const canCreateBoardGuard = ({ session, isCreatingBoard }: CanCreateBoardGuardProps) => {
  return !!session && !isCreatingBoard;
};

export const useCanCreateBoardFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardCreationState = useBoardCreationStore.use.getState();

  return useCallback(
    () =>
      canCreateBoardGuard({
        session: getSessionState().value,
        isCreatingBoard: getBoardCreationState().isLoading,
      }),
    [getBoardCreationState, getSessionState]
  );
};

export const useCanCreateBoard = () => {
  const session = useSessionStore.use.value();
  const isCreatingBoard = useBoardCreationStore.use.isLoading();

  return useMemo(
    () =>
      canCreateBoardGuard({
        session,
        isCreatingBoard,
      }),
    [isCreatingBoard, session]
  );
};
