import { useSessionStore } from '@/entities/session';
import { useSessionUserStore } from '@/entities/user';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export type CanLoadSessionUserGuardProps = {
  session: Session | undefined;
  isLoadingSessionUser: boolean;
};

export const canLoadSessionUserGuard = ({
  session,
  isLoadingSessionUser,
}: CanLoadSessionUserGuardProps) => {
  return !!session && !isLoadingSessionUser;
};

export const useCanLoadSessionUserFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getUserSessionState = useSessionUserStore.getState;

  return useCallback(
    () =>
      canLoadSessionUserGuard({
        session: getSessionStoreState().value,
        isLoadingSessionUser: getUserSessionState().isLoading,
      }),
    [getSessionStoreState, getUserSessionState]
  );
};
