import { useSessionStore } from '@/entities/session';
import { useBoardsStore, useBoardUpdateStore } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import type { BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanUpdateBoardFn } from './guards';

export const useUpdateBoard = () => {
  const canUpdateBoardsFn = useCanUpdateBoardFn();
  const getSessionState = useSessionStore.use.getState();

  const setCancelRef = useBoardUpdateStore.use.setCancelRef();
  const setBoardUpdatingState = useBoardUpdateStore.use.setState();

  const setBoardsState = useBoardsStore.use.setState();

  const updateBoard = useCallback(
    async (boardId: string, boardDraft: BoardDraft, onStart?: () => void) => {
      if (!canUpdateBoardsFn(boardId)) {
        return;
      }

      onStart?.();

      setBoardUpdatingState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';
      const result = await boardApi.updateBoard(sessionId, boardId, boardDraft, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setBoardsState((prevState) => {
            return {
              value: prevState.value?.map((board) => {
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
    [canUpdateBoardsFn, getSessionState, setCancelRef, setBoardUpdatingState, setBoardsState]
  );

  return updateBoard;
};
