import { useSessionStore } from '@/entities/session';
import { useBoardsStore, useBoardUpdateStore } from '@/entities/board';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canUpdateBoardsGuard = (
  session: Session | undefined,
  isLoadingSession: boolean,
  isUpdatingBoard: boolean,
  isLoadingBoards: boolean,
  boardId: string | undefined
) => {
  return !!session && !isLoadingSession && !isUpdatingBoard && !isLoadingBoards && !!boardId;
};

export const useCanUpdateBoard = (boardId?: string) => {
  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const isUpdatingBoard = useBoardUpdateStore.use.isLoading();
  const isLoadingBoards = useBoardsStore.use.isLoading();

  return useMemo(
    () =>
      canUpdateBoardsGuard(session, isLoadingSession, isUpdatingBoard, isLoadingBoards, boardId),
    [session, isLoadingSession, isUpdatingBoard, isLoadingBoards, boardId]
  );
};

export const useCanUpdateBoardFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getBoardUpdateStoreState = useBoardUpdateStore.use.getState();
  const getBoardsStoreState = useBoardsStore.use.getState();

  return useCallback(
    (boardId?: string) =>
      canUpdateBoardsGuard(
        getSessionStoreState().value,
        getSessionStoreState().isLoading,
        getBoardUpdateStoreState().isLoading,
        getBoardsStoreState().isLoading,
        boardId
      ),
    [getSessionStoreState, getBoardUpdateStoreState, getBoardsStoreState]
  );
};
