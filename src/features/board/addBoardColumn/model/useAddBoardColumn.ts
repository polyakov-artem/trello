import { useSessionId } from '@/entities/session';
import { boardApi, type ColumnDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useCanAddBoardColumn } from './guards';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationKeys, queryKeys } from '@/shared/config/queries';

export const useAddBoardColumn = (boardId: string) => {
  const canAddBoardColumn = useCanAddBoardColumn();
  const sessionId = useSessionId();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isAddingBoardColumn } = useMutation({
    mutationKey: mutationKeys.addBoardColumn({ boardId, sessionId }),
    mutationFn: async (columnDraft: ColumnDraft) => {
      return await boardApi.createBoardColumn({ sessionId, boardId, columnDraft });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.boards({ sessionId }) });
    },
  });

  const addBoardColumn = useCallback(
    async (columnDraft: ColumnDraft) => {
      if (!canAddBoardColumn) {
        return;
      }

      return await mutateAsync(columnDraft);
    },
    [canAddBoardColumn, mutateAsync]
  );

  return {
    addBoardColumn,
    isAddingBoardColumn,
    canAddBoardColumn,
  };
};
