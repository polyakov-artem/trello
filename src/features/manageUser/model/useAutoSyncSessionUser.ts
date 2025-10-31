import { useSessionStore } from '@/entities/session';
import { useEffect } from 'react';
import type { FetchResult } from '@/shared/lib/safeFetch';
import type { User } from '@/shared/api/user/userApi';

export type LoadUserById = (
  userId: string,
  sessionId: string,
  signal?: AbortSignal
) => Promise<FetchResult<User> | undefined>;

export const useAutoSyncSessionUser = (loadUserById: LoadUserById) => {
  const session = useSessionStore.use.session();
  const setSessionUser = useSessionStore.use.setSessionUser();

  useEffect(() => {
    if (!session) {
      setSessionUser(undefined);
      return;
    }

    const abortController = new AbortController();
    void loadUserById(session.userId, session.sessionId, abortController.signal);

    return () => {
      abortController.abort();
      setSessionUser(undefined);
    };
  }, [loadUserById, session, setSessionUser]);
};
