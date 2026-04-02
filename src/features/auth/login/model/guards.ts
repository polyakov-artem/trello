import { useIsLoadingSession, useSessionId, useSessionUserId } from '@/entities/session';
import { mutationKeys } from '@/shared/config/queries';
import { useIsMutating } from '@tanstack/react-query';

export const useCanLogin = () => {
  const isLoadingSession = useIsLoadingSession();
  const sessionId = useSessionId();
  const userId = useSessionUserId();
  const isDeletingUser =
    useIsMutating({
      mutationKey: mutationKeys.deleteUser({
        userId,
        sessionId,
      }),
    }) > 0;

  return !isLoadingSession && !isDeletingUser;
};
