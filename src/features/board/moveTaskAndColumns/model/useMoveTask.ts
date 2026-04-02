import { useBoard } from '@/entities/board';
import { useSessionId } from '@/entities/session';
import {
  boardApi,
  InsertionType,
  type Board,
  type MoveBoardTaskBodyProps,
} from '@/shared/api/board/boardApi';
import { mutationKeys, queryKeys } from '@/shared/config/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMoveTask = () => {
  const sessionId = useSessionId();
  const boardId = useBoard().id;
  const queryClient = useQueryClient();
  const queryKey = queryKeys.boards({ sessionId });

  const { mutateAsync: moveTask } = useMutation({
    mutationKey: mutationKeys.moveTask({ boardId, sessionId }),
    mutationFn: async (bodyProps: MoveBoardTaskBodyProps) => {
      return await boardApi.moveBoardTask({
        sessionId,
        boardId,
        ...bodyProps,
      });
    },

    onMutate: ({ srcColumnId, targetColumnId, srcTaskId, targetTaskId, insertionType }) => {
      void queryClient.cancelQueries({ queryKey });
      const boards = queryClient.getQueryData<Board[]>(queryKey);
      const originalBoard = boards?.find((board) => board.id === boardId);

      if (!boards || !originalBoard) {
        return;
      }

      const nextBoard = structuredClone(originalBoard);
      const { columns } = nextBoard;
      const srcColumn = columns.find((c) => c.id === srcColumnId);
      const targetColumn = columns.find((c) => c.id === targetColumnId);
      const isSameColumn = srcColumnId === targetColumnId;

      if (!srcColumn || !targetColumn) {
        return;
      }

      const srcTaskIndex = srcColumn.tasksIds.indexOf(srcTaskId);

      if (srcTaskIndex === -1) {
        return;
      }

      switch (insertionType) {
        case InsertionType.append: {
          srcColumn.tasksIds.splice(srcTaskIndex, 1);
          targetColumn.tasksIds.push(srcTaskId);
          break;
        }
        case InsertionType.before: {
          if (!targetTaskId) {
            return;
          }
          srcColumn.tasksIds.splice(srcTaskIndex, 1);
          const targetIndex = targetColumn.tasksIds.indexOf(targetTaskId);

          if (targetIndex === -1) {
            return;
          }

          const insertIndex =
            isSameColumn && srcTaskIndex < targetIndex ? targetIndex - 1 : targetIndex;

          targetColumn.tasksIds.splice(insertIndex, 0, srcTaskId);
          break;
        }
        case InsertionType.swap: {
          if (!targetTaskId) {
            return;
          }

          const targetIndex = targetColumn.tasksIds.indexOf(targetTaskId);

          if (targetIndex === -1) {
            return;
          }

          [targetColumn.tasksIds[targetIndex], srcColumn.tasksIds[srcTaskIndex]] = [
            srcColumn.tasksIds[srcTaskIndex],
            targetColumn.tasksIds[targetIndex],
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

  return moveTask;
};
