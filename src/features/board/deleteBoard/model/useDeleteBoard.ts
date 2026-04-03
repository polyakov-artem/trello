import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanDeleteBoard } from './guards';
import { mutationKeys, queryKeys } from '@/shared/config/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionId } from '@/entities/session';

export const useDeleteBoard = (boardId: string) => {
  const canDeleteBoard = useCanDeleteBoard(boardId);
  const queryClient = useQueryClient();
  const sessionId = useSessionId();

  const { mutateAsync, isPending: isDeletingBoard } = useMutation({
    mutationKey: mutationKeys.deleteBoard({
      boardId,
      sessionId,
    }),

    mutationFn: async () => {
      await boardApi.deleteBoard({ boardId, sessionId });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.boards({ sessionId }) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks({ sessionId }) });
    },
  });

  const deleteBoard = useCallback(async () => {
    if (!canDeleteBoard) {
      return;
    }

    return await mutateAsync();
  }, [canDeleteBoard, mutateAsync]);

  return { deleteBoard, isDeletingBoard, canDeleteBoard };
};
