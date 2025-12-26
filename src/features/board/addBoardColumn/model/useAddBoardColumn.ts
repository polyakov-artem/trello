import { useSessionStore } from '@/entities/session';
import { boardApi, type ColumnDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanAddBoardColumnFn } from './guards';
import { useUpdateBoard } from '@/entities/board';

export type AddBoardColumnProps = {
  boardId: string;
  columnDraft: ColumnDraft;
  onStart?: () => void;
  onEnd?: () => void;
};

export const useAddBoardColumn = () => {
  const canAddBoardColumn = useCanAddBoardColumnFn();
  const getSessionState = useSessionStore.use.getState();
  const updateBoard = useUpdateBoard();

  return useCallback(
    async ({ boardId, columnDraft, onStart, onEnd }: AddBoardColumnProps) => {
      const sessionId = getSessionState().value?.sessionId || '';

      const updateFn = (signal?: AbortSignal) =>
        boardApi.createBoardColumn({ sessionId, boardId, columnDraft, signal });

      return await updateBoard({ onStart, onEnd, updateFn, guardFn: canAddBoardColumn });
    },
    [getSessionState, updateBoard, canAddBoardColumn]
  );
};
