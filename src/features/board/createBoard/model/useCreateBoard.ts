import { useSessionStore } from '@/entities/session';
import { useBoardCreationStore, useBoardsStoreActions } from '@/entities/board';
import { boardApi, type BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanCreateBoardFn } from './guards';

export type CreateBoardProps = {
  boardDraft: BoardDraft;
  onStart?: () => void;
  onEnd?: () => void;
};

export const useCreateBoard = () => {
  const getSessionState = useSessionStore.use.getState();
  const setCancelRef = useBoardCreationStore.use.setCancelReqFn();
  const setBoardCreationState = useBoardCreationStore.use.setState();
  const canCreateBoardFn = useCanCreateBoardFn();

  const { upsertBoard } = useBoardsStoreActions();

  const createBoard = useCallback(
    async ({ onStart, onEnd, boardDraft }: CreateBoardProps) => {
      if (!canCreateBoardFn()) {
        return;
      }

      onStart?.();

      setBoardCreationState({ isLoading: true, error: undefined });

      const controller = new AbortController();
      setCancelRef(() => controller.abort());

      const sessionId = getSessionState().value?.sessionId || '';

      const result = await boardApi.createBoard({
        sessionId,
        boardDraft,
        signal: controller.signal,
      });
      const isAborted = controller.signal.aborted;

      if (!isAborted) {
        if (result.ok) {
          upsertBoard(result.data);
        } else {
          setBoardCreationState({ error: result.error });
        }
      }

      setBoardCreationState({ isLoading: false });
      onEnd?.();
      return isAborted ? undefined : result;
    },
    [canCreateBoardFn, setBoardCreationState, setCancelRef, getSessionState, upsertBoard]
  );

  return createBoard;
};
