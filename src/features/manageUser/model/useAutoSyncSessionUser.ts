import { errors } from '@/shared/constants/errorMsgs';
import { useSessionStore } from '@/entities/session';
import { useEffect } from 'react';

export type LoadUserById = (
  userId: string,
  sessionId: string,
  abortController: Promise<void>,
  throwError?: boolean
) => Promise<void>;

export const useAutoSyncSessionUser = (loadUserById: LoadUserById) => {
  const session = useSessionStore.use.session();
  const setSessionUser = useSessionStore.use.setSessionUser();

  useEffect(() => {
    if (!session) {
      setSessionUser(undefined);
      return;
    }

    let reject: ((error: Error) => void) | undefined;

    const abortController = new Promise<void>((_res, rej) => {
      reject = rej;
    });

    void loadUserById(session.userId, session.sessionId, abortController);

    return () => {
      reject?.(new Error(errors.abortedByUser));
      setSessionUser(undefined);
    };
  }, [loadUserById, session, setSessionUser]);
};
