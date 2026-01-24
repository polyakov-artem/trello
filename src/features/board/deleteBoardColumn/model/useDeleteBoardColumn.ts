import { useSessionStore } from '@/entities/session';
import type { Board } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanDeleteBoardColumnFn } from './guards';
import { useUpdateBoardFx } from '@/entities/board';

export const useDeleteBoardColumn = () => {
  const sessionId = useSessionStore.use.value()?.sessionId || '';
  const canDeleteBoardColumn = useCanDeleteBoardColumnFn();
  const updateBoard = useUpdateBoardFx();

  return useCallback(
    async (board: Board, columnId: string, onStart?: () => void, onEnd?: () => void) => {
      if (!canDeleteBoardColumn()) {
        return;
      }

      onStart?.();
      const result = await updateBoard(sessionId, board.id, {
        ...board,
        columns: board.columns.filter((column) => column.id !== columnId),
      });
      onEnd?.();
      return result;
    },
    [canDeleteBoardColumn, updateBoard, sessionId]
  );
};
