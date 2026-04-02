import { boardApi, type BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationKeys, queryKeys } from '@/shared/config/queries';
import { useSessionId } from '@/entities/session';
import { useCanCreateBoard } from './guards';

export const useCreateBoard = () => {
  const sessionId = useSessionId();
  const canCreateBoard = useCanCreateBoard();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isCreatingBoard } = useMutation({
    mutationKey: mutationKeys.createBoard({ sessionId }),
    mutationFn: async (boardDraft: BoardDraft) => {
      return await boardApi.createBoard({
        boardDraft,
        sessionId,
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.boards({ sessionId }) });
    },
  });

  const createBoard = useCallback(
    async (boardDraft: BoardDraft) => {
      if (!canCreateBoard) {
        return;
      }
      return await mutateAsync(boardDraft);
    },
    [canCreateBoard, mutateAsync]
  );

  return { createBoard, isCreatingBoard, canCreateBoard };
};
