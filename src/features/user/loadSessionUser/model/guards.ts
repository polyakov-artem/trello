import { useSessionStore } from '@/entities/session';
import { useSessionUserStore } from '@/entities/user';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export type CanLoadSessionUserGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
  isLoadingSessionUser: boolean;
};

export const canLoadSessionUserGuard = ({
  session,
  isLoadingSession,
  isLoadingSessionUser,
}: CanLoadSessionUserGuardProps) => {
  return !!session && !isLoadingSession && !isLoadingSessionUser;
};

export const useCanLoadSessionUserFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getUserSessionState = useSessionUserStore.getState;

  return useCallback(
    () =>
      canLoadSessionUserGuard({
        session: getSessionStoreState().value,
        isLoadingSession: getSessionStoreState().isLoading,
        isLoadingSessionUser: getUserSessionState().isLoading,
      }),
    [getSessionStoreState, getUserSessionState]
  );
};
