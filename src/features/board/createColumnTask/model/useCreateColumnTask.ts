import { useCallback } from 'react';
import { useCanCreateColumnTask } from './guards';
import type { TaskDraft } from '@/shared/types/types';
import { boardApi } from '@/shared/api/board/boardApi';
import { mutationKeys, queryKeys } from '@/shared/config/queries';
import { useBoard } from '@/entities/board';
import { useSessionId } from '@/entities/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type CreateColumnTaskProps = {
  columnId: string;
  taskDraft: TaskDraft;
};

export const useCreateColumnTask = () => {
  const boardId = useBoard().id;
  const canCreateColumnTask = useCanCreateColumnTask();
  const sessionId = useSessionId();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isCreatingColumnTask } = useMutation({
    mutationKey: mutationKeys.createColumnTask({ boardId, sessionId }),
    mutationFn: async (props: CreateColumnTaskProps) => {
      return await boardApi.createColumnTask({ ...props, boardId, sessionId });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks({ sessionId }) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.boards({ sessionId }) });
    },
  });

  const createColumnTask = useCallback(
    async (props: CreateColumnTaskProps) => {
      if (!canCreateColumnTask) {
        return;
      }

      return await mutateAsync(props);
    },
    [canCreateColumnTask, mutateAsync]
  );

  return {
    createColumnTask,
    isCreatingColumnTask,
    canCreateColumnTask,
  };
};
