import { useSessionStore } from '@/entities/session';
import { useTaskUpdateStore } from '@/entities/task';
import type { Session } from '@/shared/api/auth/authApi';
import { useCallback, useMemo } from 'react';

export type CanUpdateTaskGuard = {
  session: Session | undefined;
  isUpdatingTask: boolean;
};

export const canUpdateTaskGuard = ({ session, isUpdatingTask }: CanUpdateTaskGuard) => {
  return !!session && !isUpdatingTask;
};

export const useCanUpdateTask = () => {
  const session = useSessionStore.use.value();
  const isUpdatingTask = useTaskUpdateStore.use.isLoading();

  return useMemo(
    () =>
      canUpdateTaskGuard({
        session,
        isUpdatingTask,
      }),
    [isUpdatingTask, session]
  );
};

export const useCanUpdateTaskFn = () => {
  const getSessionStoreState = useSessionStore.use.getState();
  const getTaskUpdateStoreState = useTaskUpdateStore.use.getState();

  return useCallback(
    () =>
      canUpdateTaskGuard({
        session: getSessionStoreState().value,
        isUpdatingTask: getTaskUpdateStoreState().isLoading,
      }),
    [getSessionStoreState, getTaskUpdateStoreState]
  );
};
