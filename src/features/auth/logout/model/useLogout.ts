import { sessionRepository, useAuthStoreActions, useSessionId } from '@/entities/session';
import { authApi } from '@/shared/api/auth/authApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutationKeys } from '@/shared/config/queries';
import { useCanLogout } from './guards';
import { useCallback } from 'react';

type LogoutProps = {
  initiatedByUser: boolean;
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const sessionId = useSessionId();
  const { setIsLoadingSession, removeSession } = useAuthStoreActions();

  const { mutateAsync, isPending: isLoggingOut } = useMutation({
    mutationKey: mutationKeys.logout({ sessionId }),
    mutationFn: async ({ initiatedByUser }: LogoutProps) => {
      if (initiatedByUser) {
        setIsLoadingSession(true);
      }

      removeSession();
      sessionRepository.removeSession();
      await queryClient.cancelQueries({ queryKey: [sessionId] });
      queryClient.removeQueries({ queryKey: [sessionId] });

      if (sessionId) {
        try {
          await authApi.logout({ sessionId });
        } catch {
          // ignore
        }
      }

      if (initiatedByUser) {
        setIsLoadingSession(false);
      }
    },
  });

  const canLogout = useCanLogout();

  const logout = useCallback(
    async ({ initiatedByUser }: LogoutProps) => {
      if (initiatedByUser && !canLogout) {
        return;
      }

      try {
        await mutateAsync({ initiatedByUser });
      } catch (e) {
        console.log('Logout error', e);
      }
    },
    [canLogout, mutateAsync]
  );

  return {
    logout,
    isLoggingOut,
    canLogout,
  };
};
