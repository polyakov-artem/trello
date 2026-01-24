import { useBoardsStore, useBoardUpdateStore } from '@/entities/board';
import { boardApi } from '@/shared/api/board/boardApi';
import type { BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';

export const useUpdateBoardFx = () => {
  const setCancelRef = useBoardUpdateStore.use.setCancelRef();
  const setBoardUpdatingState = useBoardUpdateStore.use.setState();
  const setBoardsState = useBoardsStore.use.setState();

  const updateBoard = useCallback(
    async (sessionId: string, boardId: string, boardDraft: BoardDraft) => {
      setBoardUpdatingState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

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
    [setCancelRef, setBoardUpdatingState, setBoardsState]
  );

  return updateBoard;
};
