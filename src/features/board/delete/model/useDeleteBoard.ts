import { useSessionStore } from '@/entities/session';
import { useBoardsStore, useBoardDeletionStore } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';

export const useDeleteBoard = () => {
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const checkIfDeletingBoard = useBoardDeletionStore.use.checkIfLoading();
  const setCancelRef = useBoardDeletionStore.use.setCancelRef();
  const setBoardDeletionState = useBoardDeletionStore.use.setState();

  const setBoardsState = useBoardsStore.use.setState();

  const deleteBoard = useCallback(
    async (boardId: string) => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfDeletingBoard() || checkIfLoadingSession() || !sessionId) {
        return;
      }

      setBoardDeletionState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const result = await boardApi.deleteBoard(sessionId, boardId, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setBoardsState((prevState) => {
            return {
              value: prevState.value.filter((board) => board.id !== boardId),
            };
          });
        } else {
          setBoardDeletionState({ error: result.error });
        }
      }

      setBoardDeletionState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [
      checkIfDeletingBoard,
      checkIfLoadingSession,
      getSession,
      setCancelRef,
      setBoardDeletionState,
      setBoardsState,
    ]
  );

  return deleteBoard;
};
