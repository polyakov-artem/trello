import { useSessionId } from '@/entities/session';
import { boardApi } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanDeleteBoardColumn } from './guards';
import { useBoard } from '@/entities/board';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationKeys, queryKeys } from '@/shared/config/queries';

export const useDeleteBoardColumn = (columnId: string) => {
  const queryClient = useQueryClient();
  const sessionId = useSessionId();
  const boardId = useBoard().id;
  const canDeleteBoardColumn = useCanDeleteBoardColumn(columnId);

  const { mutateAsync, isPending: isDeletingBoardColumn } = useMutation({
    mutationKey: mutationKeys.deleteBoardColumn({
      sessionId,
      boardId,
    }),
    mutationFn: async (deleteTasks: boolean) => {
      return await boardApi.deleteBoardColumn({
        sessionId,
        boardId,
        columnId,
        deleteTasks,
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.boards({ sessionId }) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks({ sessionId }) });
    },
  });

  const deleteBoardColumn = useCallback(
    async (deleteTasks: boolean) => {
      if (!canDeleteBoardColumn) {
        return;
      }

      return await mutateAsync(deleteTasks);
    },
    [canDeleteBoardColumn, mutateAsync]
  );

  return { deleteBoardColumn, isDeletingBoardColumn, canDeleteBoardColumn };
};
