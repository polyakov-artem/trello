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
  const getSessionStoreState = useSessionStore.use.getState();
  const canDeleteBoardColumn = useCanDeleteBoardColumnFn();
  const updateBoard = useUpdateBoard();

  return useCallback(
    async ({ boardId, columnId, onStart, onEnd }: DeleteBoardColumnProps) => {
      const sessionId = getSessionStoreState().value?.sessionId || '';
      const updateFn = (signal?: AbortSignal) =>
        boardApi.deleteBoardColumn({ sessionId, boardId, columnId, signal });

      return await updateBoard({ onStart, onEnd, updateFn, guardFn: canDeleteBoardColumn });
    },
    [getSessionStoreState, updateBoard, canDeleteBoardColumn]
  );
};
