import {
  useBoardDeletionStore,
  useBoardsIsLoading,
  useBoardsStore,
  useBoardUpdateStore,
} from '@/entities/board';
import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type canAddBoardColumnGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isLoadingBoards: boolean;
  isUpdatingBoard: boolean;
  isDeletingBoard: boolean;
};

export const canAddBoardColumn = (props: canAddBoardColumnGuardProps) => {
  const { session, isLoadingSession, isUpdatingBoard, isDeletingBoard, isLoadingBoards } = props;
  return !!session && !isLoadingSession && !isUpdatingBoard && !isDeletingBoard && !isLoadingBoards;
};

export const useCanAddBoardColumn = () => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();
  const isDeletingBoard = useBoardDeletionStore.use.isLoading();
  const isLoadingBoards = useBoardsIsLoading();

  return useMemo(
    () =>
      canAddBoardColumn({
        session,
        isLoadingSession,
        isUpdatingBoard,
        isDeletingBoard,
        isLoadingBoards,
      }),
    [isDeletingBoard, isLoadingBoards, isLoadingSession, isUpdatingBoard, session]
  );
};
export const useCanAddBoardColumnFn = () => {
  const getSessionState = useSessionStore.use.getState();
  const getBoardUpdateState = useBoardUpdateStore.use.getState();
  const getBoardDeletionState = useBoardDeletionStore.use.getState();
  const getBoardsState = useBoardsStore.getState;

  return useCallback(
    () =>
      canAddBoardColumn({
        session: getSessionState().value,
        isLoadingSession: getSessionState().isLoading,
        isUpdatingBoard: getBoardUpdateState().isLoading,
        isDeletingBoard: getBoardDeletionState().isLoading,
        isLoadingBoards: getBoardsState().isLoading,
      }),
    [getBoardDeletionState, getBoardUpdateState, getBoardsState, getSessionState]
  );
};
