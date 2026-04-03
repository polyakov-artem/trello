import { boardApi, type BoardDraft } from '@/shared/api/board/boardApi';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationKeys, queryKeys } from '@/shared/config/queries';
import { useSessionId } from '@/entities/session';
import { useCanEditBoard } from './guards';

export const useEditBoard = (boardId: string) => {
  const sessionId = useSessionId();
  const canEditBoard = useCanEditBoard(boardId);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isEditingBoard } = useMutation({
    mutationKey: mutationKeys.editBoard({ sessionId, boardId }),
    mutationFn: async (boardDraft: BoardDraft) => {
      return await boardApi.changeBoardTitle({
        boardId,
        boardDraft,
        sessionId,
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.boards({ sessionId }) });
    },
  });

  const editBoard = useCallback(
    async (boardDraft: BoardDraft) => {
      if (!canEditBoard) {
        return;
      }
      return await mutateAsync(boardDraft);
    },
    [canEditBoard, mutateAsync]
  );

  return { editBoard, isEditingBoard, canEditBoard };
};
