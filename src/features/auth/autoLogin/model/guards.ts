import { useSessionStore } from '@/entities/session';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';

export const canLoginGuard = (session: Session | undefined, isLoadingSession: boolean) => {
  return !session && !isLoadingSession;
};

export const useCanLoginFn = () => {
  const getState = useSessionStore.use.getState();

  return useCallback(() => canLoginGuard(getState().value, getState().isLoading), [getState]);
};
