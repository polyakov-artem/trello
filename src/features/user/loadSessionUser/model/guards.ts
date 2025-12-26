import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export const canLoadSessionUserGuard = (
  session: Session | undefined,
  isLoadingSession: boolean
) => {
  return !!session && !isLoadingSession;
};

export const useCanLoadSessionUserFn = () => {
  const getState = useSessionStore.use.getState();

  return useCallback(
    () => canLoadSessionUserGuard(getState().value, getState().isLoading),
    [getState]
  );
};
