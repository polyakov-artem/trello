import { useSessionStore } from '@/entities/session';
import { useBoardsStore, useBoardDeletionStore } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanDeleteBoardFn } from './guards';

export const useDeleteBoard = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const canDeleteBoardFn = useCanDeleteBoardFn();
  const setCancelRef = useBoardDeletionStore.use.setCancelRef();
  const setBoardDeletionState = useBoardDeletionStore.use.setState();

  const setBoardsState = useBoardsStore.use.setState();

  const deleteBoard = useCallback(
    async (boardId: string, onStart?: () => void, onEnd?: () => void) => {
      if (!canDeleteBoardFn()) {
        return;
      }

      onStart?.();

      setBoardDeletionState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionStoreState().value?.sessionId || '';

      const result = await boardApi.deleteBoard(sessionId, boardId, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setBoardsState((prevState) => {
            return {
              value: prevState.value?.filter((board) => board.id !== boardId),
            };
          });
        } else {
          setBoardDeletionState({ error: result.error });
        }
      }

      setBoardDeletionState({ isLoading: false });

      onEnd?.();
      return isAborted ? undefined : result;
    },
    [canDeleteBoardFn, getSessionStoreState, setCancelRef, setBoardDeletionState, setBoardsState]
  );

  return deleteBoard;
};
