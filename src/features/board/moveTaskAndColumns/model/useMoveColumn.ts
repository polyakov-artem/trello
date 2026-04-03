import {
  boardApi,
  InsertionType,
  type Board,
  type MoveBoardColumnBodyProps,
} from '@/shared/api/board/boardApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationKeys, queryKeys } from '@/shared/config/queries';
import { useSessionId } from '@/entities/session';
import { useBoard } from '@/entities/board';

export const useMoveColumn = () => {
  const sessionId = useSessionId();
  const boardId = useBoard().id;
  const queryClient = useQueryClient();
  const queryKey = queryKeys.boards({ sessionId });

  const { mutateAsync: moveColumn } = useMutation({
    mutationKey: mutationKeys.moveColumn({ boardId, sessionId }),
    mutationFn: async (bodyProps: MoveBoardColumnBodyProps) => {
      return await boardApi.moveBoardColumn({ boardId, sessionId, ...bodyProps });
    },

    onMutate: ({ srcColumnId, targetColumnId, insertionType }) => {
      void queryClient.cancelQueries({ queryKey });
      const boards = queryClient.getQueryData<Board[]>(queryKey);
      const originalBoard = boards?.find((board) => board.id === boardId);

      if (!boards || !originalBoard) {
        return;
      }

      const nextBoard = structuredClone(originalBoard);
      const { columns } = nextBoard;
      const srcColumnIndex = columns.findIndex((c) => c.id === srcColumnId);
      const targetColumnIndex = columns.findIndex((c) => c.id === targetColumnId);

      if (srcColumnIndex === -1 || targetColumnIndex === -1) {
        return;
      }

      switch (insertionType) {
        case InsertionType.append: {
          const [srcColumn] = columns.splice(srcColumnIndex, 1);
          columns.push(srcColumn);
          break;
        }
        case InsertionType.before: {
          const [srcColumn] = columns.splice(srcColumnIndex, 1);
          const insertIndex =
            srcColumnIndex < targetColumnIndex ? targetColumnIndex - 1 : targetColumnIndex;
          columns.splice(insertIndex, 0, srcColumn);
          break;
        }
        case InsertionType.swap: {
          [columns[targetColumnIndex], columns[srcColumnIndex]] = [
            columns[srcColumnIndex],
            columns[targetColumnIndex],
          ];
          break;
        }
      }

      queryClient.setQueryData(
        queryKey,
        boards.map((board) => (board.id === boardId ? nextBoard : board))
      );

      return { originalBoard };
    },

    onError: (_error, _variables, onMutateResult) => {
      const originalBoard = onMutateResult?.originalBoard;

      if (!originalBoard) {
        return;
      }

      queryClient.setQueryData(
        queryKey,
        queryClient.getQueryData<Board[]>(queryKey)?.map((board) => {
          if (board.id === boardId) {
            return originalBoard;
          }
          return board;
        })
      );
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  return moveColumn;
};
