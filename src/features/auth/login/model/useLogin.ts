import { mutationKeys } from '@/shared/config/queries';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/auth/authApi';
import {
  sessionRepository,
  useAuthStoreActions,
  useLogoutContext,
  useSessionId,
} from '@/entities/session';
import { useCanLogin } from './guards';
import { useCallback } from 'react';

export const useLogin = (userId: string) => {
  const { logout } = useLogoutContext();
  const { setSession, setIsLoadingSession } = useAuthStoreActions();
  const sessionId = useSessionId();
  const canLogin = useCanLogin();

  const { mutateAsync, isPending: isLoggingIn } = useMutation({
    mutationKey: mutationKeys.login(),
    mutationFn: async () => {
      setIsLoadingSession(true);

      if (sessionId) {
        await logout({ initiatedByUser: false });
      }

      try {
        const newSession = (await authApi.loginWithUserId({ userId })).data;
        setSession(newSession);
        sessionRepository.saveSession(newSession);
        return newSession;
      } finally {
        setIsLoadingSession(false);
      }
    },
  });

  const login = useCallback(async () => {
    if (!canLogin) {
      return;
    }

    await mutateAsync();
  }, [canLogin, mutateAsync]);

  return { login, isLoggingIn, canLogin };
};
