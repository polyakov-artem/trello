import { useSessionStore } from '@/entities/session';
import { boardApi, type BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanUpdateBoardTitleFn } from './guards';
import { useUpdateBoard } from '@/entities/board';

export type UpdateBoardTitleProps = {
  boardId: string;
  boardDraft: BoardDraft;
  onStart?: () => void;
  onEnd?: () => void;
};

export const useUpdateBoardTitle = () => {
  const getSessionState = useSessionStore.use.getState();
  const updateBoard = useUpdateBoard();
  const canUpdateBoardTitleFn = useCanUpdateBoardTitleFn();

  return useCallback(
    async ({ onStart, onEnd, boardId, boardDraft }: UpdateBoardTitleProps) => {
      const sessionId = getSessionState().value?.sessionId || '';
      const updateFn = (signal?: AbortSignal) =>
        boardApi.changeBoardTitle({ sessionId, boardId, boardDraft, signal });

      return await updateBoard({ onStart, onEnd, updateFn, guardFn: canUpdateBoardTitleFn });
    },
    [getSessionState, updateBoard, canUpdateBoardTitleFn]
  );
};
