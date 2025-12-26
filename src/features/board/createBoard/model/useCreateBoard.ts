import { useSessionStore } from '@/entities/session';
import { useBoardCreationStore, useBoardsStore } from '@/entities/board';
import { boardApi, type BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanCreateBoardFn } from './guards';

export const useCreateBoard = () => {
  const getSessionState = useSessionStore.use.getState();
  const setCancelRef = useBoardCreationStore.use.setCancelRef();
  const setBoardCreationState = useBoardCreationStore.use.setState();
  const canCreateBoardFn = useCanCreateBoardFn();

  const setBoardsState = useBoardsStore.use.setState();

  const createBoard = useCallback(
    async (boardDraft: BoardDraft, onStart?: () => void, onEnd?: () => void) => {
      if (!canCreateBoardFn()) {
        return;
      }

      onStart?.();

      setBoardCreationState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';

      const result = await boardApi.createBoard(sessionId, boardDraft, controller.signal);
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          setBoardsState((prevState) => {
            return { value: prevState.value ? [...prevState.value, result.data] : [result.data] };
          });
        } else {
          setBoardCreationState({ error: result.error });
        }
      }

      setBoardCreationState({ isLoading: false });

      onEnd?.();
      return isAborted ? undefined : result;
    },
    [canCreateBoardFn, setBoardCreationState, setCancelRef, getSessionState, setBoardsState]
  );

  return createBoard;
};
