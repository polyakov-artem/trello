import {
  useBoardDeletionStore,
  useBoardsIsLoading,
  useBoardsStore,
  useBoardUpdateStore,
} from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanDeleteBoardColumnGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isUpdatingBoard: boolean;
  isDeletingBoard: boolean;
  isLoadingBoards: boolean;
};

export const canDeleteBoardColumnGuard = (props: CanDeleteBoardColumnGuardProps) => {
  const { session, isLoadingSession, isUpdatingBoard, isDeletingBoard } = props;

  return !!session && !isLoadingSession && !isUpdatingBoard && !isDeletingBoard;
};

export const useCanDeleteBoardColumn = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();
  const isLoadingBoards = useBoardsIsLoading();

  return useMemo(
    () =>
      canDeleteBoardColumnGuard({
        session,
        isLoadingSession,
        isUpdatingBoard,
        isDeletingBoard,
        isLoadingBoards,
      }),
    [isDeletingBoard, isLoadingBoards, isLoadingSession, isUpdatingBoard, session]
  );
};

export const useCanDeleteBoardColumnFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();
  const getBoardDeletionState = useBoardDeletionStore.use.getState();
  const getBoardsState = useBoardsStore.getState;

  return useCallback(
    () =>
      canDeleteBoardColumnGuard({
        session: getSessionState().value,
        isLoadingSession: getSessionState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
        isDeletingBoard: getBoardDeletionState().isLoading,
        isLoadingBoards: getBoardsState().isLoading,
      }),
    [getSessionState, getBoardUpdateState, getBoardDeletionState, getBoardsState]
  );
};
