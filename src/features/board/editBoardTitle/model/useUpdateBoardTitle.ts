import { useSessionStore } from '@/entities/session';
import type { BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanUpdateBoardTitleFn } from './guards';
import { useUpdateBoardFx } from '@/entities/board';

export const useUpdateBoardTitle = () => {
  const sessionId = useSessionStore.use.value()?.sessionId || '';
  const canUpdateBoardTitleFn = useCanUpdateBoardTitleFn();
  const updateBoard = useUpdateBoardFx();

  return useCallback(
    async (boardId: string, boardDraft: BoardDraft, onStart?: () => void, onEnd?: () => void) => {
      if (!canUpdateBoardTitleFn()) {
        return;
      }

      onStart?.();
      const result = await updateBoard(sessionId, boardId, boardDraft);
      onEnd?.();
      return result;
    },
    [canUpdateBoardTitleFn, updateBoard, sessionId]
  );
};
