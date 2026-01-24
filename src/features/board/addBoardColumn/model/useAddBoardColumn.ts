import { useSessionStore } from '@/entities/session';
import type { BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanAddBoardColumnFn } from './guards';
import { useUpdateBoardFx } from '@/entities/board';

export const useAddBoardColumn = () => {
  const sessionId = useSessionStore.use.value()?.sessionId || '';
  const canAddBoardColumn = useCanAddBoardColumnFn();
  const updateBoard = useUpdateBoardFx();

  return useCallback(
    async (boardId: string, boardDraft: BoardDraft, onStart?: () => void, onEnd?: () => void) => {
      if (!canAddBoardColumn()) {
        return;
      }

      onStart?.();
      const result = await updateBoard(sessionId, boardId, boardDraft);
      onEnd?.();
      return result;
    },
    [canAddBoardColumn, updateBoard, sessionId]
  );
};
