import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/shared/api/auth/authApi';
import { isFetchError } from '@/shared/lib/safeFetch';
import { queryKeys } from '@/shared/config/queries';
import { sessionRepository, useAuthStoreActions } from '@/entities/session';
import { useCanAutoLogin } from './guards';

export function useAutoLoginQuery() {
  const canAutoLogin = useCanAutoLogin();
  const { setIsLoadingSession, setSession } = useAuthStoreActions();

  return useQuery({
    queryKey: queryKeys.autoLogin,
    queryFn: async ({ signal }) => {
      const savedSessionId = sessionRepository.loadSession()?.sessionId || '';

      if (!canAutoLogin || !savedSessionId) {
        return null;
      }

      setIsLoadingSession(true);

      try {
        const session = (await authApi.loginWithSessionId({ sessionId: savedSessionId, signal }))
          .data;
        setSession(session);
        return session;
      } catch (error) {
        if (isFetchError(error) && error.status === 404) {
          sessionRepository.removeSession();
        }

        return null;
      } finally {
        setIsLoadingSession(false);
      }
    },

    staleTime: Infinity,
    retry: false,
  });
}
