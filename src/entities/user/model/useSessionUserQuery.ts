import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/config/queries';
import { userApi } from '@/shared/api/user/userApi';
import { useSessionId, useSessionUserId } from '@/entities/session';

export const useSessionUserQuery = () => {
  const sessionId = useSessionId();
  const userId = useSessionUserId();

  const {
    data: sessionUser,
    isFetching: isFetchingSessionUser,
    isPending: isPendingSessionUser,
    error: sessionUserError,
  } = useQuery({
    queryKey: queryKeys.sessionUser({ sessionId }),
    queryFn: async ({ signal }) => (await userApi.getUserById({ userId, sessionId, signal })).data,
    enabled: !!sessionId,
  });

  return {
    sessionUser,
    isFetchingSessionUser,
    isPendingSessionUser,
    sessionUserError,
  };
};
