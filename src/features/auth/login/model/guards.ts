import { useSessionStore } from '@/entities/session';
import { useCallback } from 'react';

export const canLoginWithLogoutGuard = (isLoadingSession: boolean) => {
  return !isLoadingSession;
};

export const useCanLoginWithLogoutFn = () => {
  const getState = useSessionStore.use.getState();

  return useCallback(() => canLoginWithLogoutGuard(getState().isLoading), [getState]);
};

export const useCanLoginWithLogout = () => {
  const isLoading = useSessionStore.use.isLoading();

  return canLoginWithLogoutGuard(isLoading);
};
