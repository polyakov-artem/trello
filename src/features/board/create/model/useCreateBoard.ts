import { useSessionStore } from '@/entities/session';
import { useBoardCreationStore, useBoardsStore } from '@/entities/board';
import { boardApi, type BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';

export const useCreateBoard = () => {
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const checkIfCreatingBoard = useBoardCreationStore.use.checkIfLoading();
  const setCancelRef = useBoardCreationStore.use.setCancelRef();
  const setBoardCreationState = useBoardCreationStore.use.setState();

  const setBoardsState = useBoardsStore.use.setState();

  const createBoard = useCallback(
    async (board: BoardDraft) => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfCreatingBoard() || checkIfLoadingSession() || !sessionId) {
        return;
      }

      setBoardCreationState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const result = await boardApi.createBoard(sessionId, board, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setBoardsState((prevState) => {
            return { value: [...prevState.value, result.data] };
          });
        } else {
          setBoardCreationState({ error: result.error });
        }
      }

      setBoardCreationState({ isLoading: false });
      return isAborted ? undefined : result;
    },
    [
      checkIfCreatingBoard,
      checkIfLoadingSession,
      getSession,
      setCancelRef,
      setBoardCreationState,
      setBoardsState,
    ]
  );

  return createBoard;
};
