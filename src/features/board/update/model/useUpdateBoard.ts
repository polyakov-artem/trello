import { useSessionStore } from '@/entities/session';
import { useBoardsStore, useBoardUpdateStore } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import type { BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';

export const useUpdateBoard = () => {
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const checkIfUpdatingBoard = useBoardUpdateStore.use.checkIfLoading();
  const setCancelRef = useBoardUpdateStore.use.setCancelRef();
  const setBoardUpdatingState = useBoardUpdateStore.use.setState();

  const setBoardsState = useBoardsStore.use.setState();

  const updateBoard = useCallback(
    async (boardId: string, board: BoardDraft) => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfUpdatingBoard() || checkIfLoadingSession() || !sessionId) {
        return;
      }

      setBoardUpdatingState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const result = await boardApi.updateBoard(sessionId, boardId, board, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setBoardsState((prevState) => {
            return {
              value: prevState.value.map((board) => {
                if (board.id === boardId) {
                  return result.data;
                }

                return board;
              }),
            };
          });
        } else {
          setBoardUpdatingState({ error: result.error });
        }
      }

      setBoardUpdatingState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [
      checkIfLoadingSession,
      checkIfUpdatingBoard,
      getSession,
      setCancelRef,
      setBoardUpdatingState,
      setBoardsState,
    ]
  );

  return updateBoard;
};
