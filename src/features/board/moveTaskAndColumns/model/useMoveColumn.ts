import { useSessionStore } from '@/entities/session';
import { boardApi, type MoveBoardColumnBodyProps } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanMoveTaskOrColumnsFn } from './guards';
import { useUpdateBoard } from '@/entities/board';

export type MoveColumnProps = {
  onStart?: () => void;
  onEnd?: () => void;
  boardId: string;
} & MoveBoardColumnBodyProps;

export const useMoveColumn = () => {
  const getSessionState = useSessionStore.use.getState();
  const updateBoard = useUpdateBoard();
  const canMoveTaskOrColumnsFn = useCanMoveTaskOrColumnsFn();

  return useCallback(
    async ({ onStart, onEnd, boardId, ...bodyProps }: MoveColumnProps) => {
      const sessionId = getSessionState().value?.sessionId || '';

      const updateFn = (signal?: AbortSignal) =>
        boardApi.moveBoardColumn({
          sessionId,
          signal,
          boardId,
          ...bodyProps,
        });

      return await updateBoard({ onStart, onEnd, updateFn, guardFn: canMoveTaskOrColumnsFn });
    },
    [getSessionState, updateBoard, canMoveTaskOrColumnsFn]
  );
};
