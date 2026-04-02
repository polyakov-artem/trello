import { useCallback, useMemo } from 'react';
import { useCanDeleteTasks } from './guards';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationKeys, queryKeys } from '@/shared/config/queries';
import { useSessionId } from '@/entities/session';
import { taskApi } from '@/shared/api/task/taskApi';

export const useDeleteTasks = (
  taskIdOrTasksIds: string[] | string,
  boardIdsOrBoardsIds: string[] | string
) => {
  const sessionId = useSessionId();
  const queryClient = useQueryClient();

  const tasksIds = useMemo(() => [taskIdOrTasksIds].flat(), [taskIdOrTasksIds]);
  const boardsIds = useMemo(() => [boardIdsOrBoardsIds].flat(), [boardIdsOrBoardsIds]);
  const canDeleteTasks = useCanDeleteTasks(tasksIds, boardsIds);

  const { mutateAsync, isPending: isDeletingTasks } = useMutation({
    mutationKey: mutationKeys.deleteTasks({ sessionId, tasksIds, boardsIds }),
    mutationFn: async () => {
      await taskApi.deleteTasks({ sessionId, tasksIds });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.boards({ sessionId }) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks({ sessionId }) });
    },
  });

  const deleteTasks = useCallback(async () => {
    if (!canDeleteTasks) {
      return;
    }

    return await mutateAsync();
  }, [canDeleteTasks, mutateAsync]);

  return { deleteTasks, isDeletingTasks, isDisabled: !canDeleteTasks };
};
