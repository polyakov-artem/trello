import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/config/queries';
import { boardApi } from '@/shared/api/board/boardApi';
import { useSessionId } from '@/entities/session';

export const useBoardsQuery = () => {
  const sessionId = useSessionId();

  const {
    data: boards,
    isFetching: isFetchingBoards,
    isPending: isPendingBoards,
    error: boardsError,
  } = useQuery({
    queryKey: queryKeys.boards({ sessionId }),
    queryFn: async ({ signal }) => (await boardApi.getBoards({ sessionId, signal })).data,
    enabled: !!sessionId,
  });

  return {
    boards,
    isFetchingBoards,
    isPendingBoards,
    boardsError,
  };
};
