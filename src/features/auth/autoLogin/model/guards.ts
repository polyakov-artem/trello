import { useIsLoadingSession, useSessionId } from '@/entities/session/model/authStore';

export const useCanAutoLogin = () => {
  const isLoadingSession = useIsLoadingSession();
  const sessionId = useSessionId();

  return !sessionId && !isLoadingSession;
};
