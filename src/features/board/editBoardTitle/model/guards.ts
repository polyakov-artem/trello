import {
  useBoardDeletionStore,
  useBoardsIsLoading,
  useBoardsStore,
  useBoardUpdateStore,
} from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanUpdateBoardTitleGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isUpdatingBoard: boolean;
  isDeletingBoard: boolean;
  isLoadingBoards: boolean;
};

export const canUpdateBoardTitleGuard = (props: CanUpdateBoardTitleGuardProps) => {
  const { session, isLoadingSession, isUpdatingBoard, isDeletingBoard } = props;

  return !!session && !isLoadingSession && !isUpdatingBoard && !isDeletingBoard;
};

export const useCanUpdateBoardTitle = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();
  const isLoadingBoards = useBoardsIsLoading();

  return useMemo(
    () =>
      canUpdateBoardTitleGuard({
        session,
        isLoadingSession,
        isUpdatingBoard,
        isDeletingBoard,
        isLoadingBoards,
      }),
    [isDeletingBoard, isLoadingBoards, isLoadingSession, isUpdatingBoard, session]
  );
};

export const useCanUpdateBoardTitleFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();
  const getBoardDeletionState = useBoardDeletionStore.use.getState();
  const getBoardsState = useBoardsStore.getState;

  return useCallback(
    () =>
      canUpdateBoardTitleGuard({
        session: getSessionState().value,
        isLoadingSession: getSessionState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
        isDeletingBoard: getBoardDeletionState().isLoading,
        isLoadingBoards: getBoardsState().isLoading,
      }),
    [getSessionState, getBoardUpdateState, getBoardDeletionState, getBoardsState]
  );
};
