import { useSessionStore } from '@/entities/session';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanDeleteBoardColumnFn } from './guards';
import { useUpdateBoard } from '@/entities/board';

export type DeleteBoardColumnProps = {
  boardId: string;
  columnId: string;
  onStart?: () => void;
  onEnd?: () => void;
};

export const useDeleteBoardColumn = () => {
  const sessionId = useSessionStore.use.value()?.sessionId || '';
  const canDeleteBoardColumn = useCanDeleteBoardColumnFn();
  const updateBoard = useUpdateBoard();

  return useCallback(
    async ({ boardId, columnId, onStart, onEnd }: DeleteBoardColumnProps) => {
      const updateFn = (signal?: AbortSignal) =>
        boardApi.deleteBoardColumn({ sessionId, boardId, columnId, signal });

      return await updateBoard({ onStart, onEnd, updateFn, guardFn: canDeleteBoardColumn });
    },
    [updateBoard, canDeleteBoardColumn, sessionId]
  );
};
