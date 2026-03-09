import { useSessionStore } from '@/entities/session';
import { boardApi, type MoveBoardTaskBodyProps } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanMoveTaskOrColumnsFn } from './guards';
import { useUpdateBoard } from '@/entities/board';

export type MoveTaskProps = {
  onStart?: () => void;
  onEnd?: () => void;
  boardId: string;
} & MoveBoardTaskBodyProps;

export const useMoveTask = () => {
  const getSessionState = useSessionStore.use.getState();
  const updateBoard = useUpdateBoard();
  const canMoveTaskOrColumnsFn = useCanMoveTaskOrColumnsFn();

  return useCallback(
    async ({ onStart, onEnd, boardId, ...bodyProps }: MoveTaskProps) => {
      const sessionId = getSessionState().value?.sessionId || '';

      const updateFn = (signal?: AbortSignal) =>
        boardApi.moveBoardTask({
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
