import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/config/queries';
import { taskApi } from '@/shared/api/task/taskApi';
import { useSessionId } from '@/entities/session';

export const useTasksQuery = () => {
  const sessionId = useSessionId();

  const {
    data: tasks,
    isFetching: isFetchingTasks,
    isPending: isPendingTasks,
    error: tasksError,
  } = useQuery({
    queryKey: queryKeys.tasks({ sessionId }),
    queryFn: async ({ signal }) => (await taskApi.getTasks({ sessionId, signal })).data,
    enabled: !!sessionId,
  });

  return {
    tasks,
    isFetchingTasks,
    isPendingTasks,
    tasksError,
  };
};
