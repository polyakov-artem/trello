import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export const canLogoutGuard = (session: Session | undefined, isLoadingSession: boolean) =>
  !!session && !isLoadingSession;

export const useCanLogoutFn = () => {
  const getState = useSessionStore.use.getState();

  return useCallback(() => canLogoutGuard(getState().value, getState().isLoading), [getState]);
};

export const useCanLogout = () => {
  const session = useSessionStore.use.value();
  const isLoading = useSessionStore.use.isLoading();

  return useMemo(() => canLogoutGuard(session, isLoading), [isLoading, session]);
};
