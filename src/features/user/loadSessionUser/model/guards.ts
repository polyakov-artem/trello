import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export type CanLoadSessionUserGuardProps = {
  session: Session | undefined;
  isLoadingSession: boolean;
};

export const canLoadSessionUserGuard = ({
  session,
  isLoadingSession,
}: CanLoadSessionUserGuardProps) => {
  return !!session && !isLoadingSession;
};

export const useCanLoadSessionUserFn = () => {
  const getState = useSessionStore.use.getState();

  return useCallback(
    () =>
      canLoadSessionUserGuard({
        session: getState().value,
        isLoadingSession: getState().isLoading,
      }),
    [getState]
  );
};
