import { useLoginWithSavedSession } from '@/features/auth/autoLogin';
import { useLoadSessionUser } from '@/features/user/loadSessionUser';
import { useEffect, type FC, type PropsWithChildren } from 'react';
import { useLoadTasks } from '@/features/task/loadTasks';
import { useSessionStore } from '@/entities/session';
import { useLoadBoards } from '@/features/board/loadBoards';

export const AppLoader: FC<PropsWithChildren> = ({ children }) => {
  const loginWithSavedSession = useLoginWithSavedSession();
  const loadSessionUser = useLoadSessionUser();
  const loadTasks = useLoadTasks();
  const loadBoards = useLoadBoards();
  const session = useSessionStore.use.value();

  useEffect(() => {
    void void loginWithSavedSession();
  }, [loginWithSavedSession]);

  useEffect(() => {
    if (session) {
      void loadSessionUser(session.userId, session.sessionId);
      void loadTasks();
      void loadBoards();
    }
  }, [loadBoards, loadSessionUser, loadTasks, session]);

  return <>{children}</>;
};
