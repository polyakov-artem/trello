import { useSessionStore } from '@/entities/session';
import { useBoardDeletionStore, useBoardsStoreActions } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanDeleteBoardFn } from './guards';

export type DeleteBoardProps = {
  boardId: string;
  onStart?: () => void;
  onEnd?: () => void;
};

export const useDeleteBoard = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const canDeleteBoardFn = useCanDeleteBoardFn();
  const setCancelRef = useBoardDeletionStore.use.setCancelReqFn();
  const setBoardDeletionState = useBoardDeletionStore.use.setState();
  const removeBoardFromStore = useBoardsStoreActions().removeBoard;

  const deleteBoard = useCallback(
    async ({ boardId, onStart, onEnd }: DeleteBoardProps) => {
      if (!canDeleteBoardFn()) {
        return;
      }

      onStart?.();

      setBoardDeletionState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionStoreState().value?.sessionId || '';

      const result = await boardApi.deleteBoard({
        sessionId,
        boardId,
        signal: controller.signal,
      });
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          removeBoardFromStore(boardId);
        } else {
          setBoardDeletionState({ error: result.error });
        }
      }

      setBoardDeletionState({ isLoading: false });

      onEnd?.();
      return isAborted ? undefined : result;
    },
    [
      canDeleteBoardFn,
      getSessionStoreState,
      removeBoardFromStore,
      setBoardDeletionState,
      setCancelRef,
    ]
  );

  return deleteBoard;
};
