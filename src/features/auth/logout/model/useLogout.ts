import {
  useBoardCreationStore,
  useBoardDeletionStore,
  useBoardsStoreActions,
  useBoardUpdateStore,
} from '@/entities/board';
import { sessionRepository, useSessionStore } from '@/entities/session';
import {
  useTaskCreationStore,
  useTaskDeletionStore,
  useTasksStore,
  useTaskUpdateStore,
} from '@/entities/task';
import { useSessionUserStore } from '@/entities/user';
import { authApi } from '@/shared/api/auth/authApi';
import { useCallback } from 'react';
import { useCanLogoutFn } from './guards';

export const useLogout = () => {
  const setSessionState = useSessionStore.setState;
  const getSessionState = useSessionStore.getState;

  const resetSessionStore = useSessionStore.use.reset();
  const resetSessionUserStore = useSessionUserStore.use.reset();

  const resetTasksStore = useTasksStore.use.reset();
  const resetTaskCreationStore = useTaskCreationStore.use.reset();
  const resetTaskDeletionStore = useTaskDeletionStore.use.reset();
  const resetTaskUpdateStore = useTaskUpdateStore.use.reset();

  const resetBoardsStore = useBoardsStoreActions().reset;
  const resetBoardCreationStore = useBoardCreationStore.use.reset();
  const resetBoardDeletionStore = useBoardDeletionStore.use.reset();
  const resetBoardUpdateStore = useBoardUpdateStore.use.reset();

  const canLogoutFn = useCanLogoutFn();

  const logout = useCallback(
    async (onStart?: () => void, onEnd?: () => void) => {
      if (!canLogoutFn()) {
        return;
      }

      onStart?.();

      resetSessionStore();
      resetSessionUserStore();

      resetTasksStore();
      resetTaskCreationStore();
      resetTaskDeletionStore();
      resetTaskUpdateStore();

      resetBoardsStore();
      resetBoardCreationStore();
      resetBoardDeletionStore();
      resetBoardUpdateStore();

      setSessionState({ isLoading: true });
      await authApi.logout(getSessionState().value?.sessionId || '');
      await sessionRepository.removeSession();
      setSessionState({ isLoading: false });

      onEnd?.();

      return { success: true };
    },
    [
      canLogoutFn,
      resetSessionStore,
      resetSessionUserStore,
      resetTasksStore,
      resetTaskCreationStore,
      resetTaskDeletionStore,
      resetTaskUpdateStore,
      resetBoardsStore,
      resetBoardCreationStore,
      resetBoardDeletionStore,
      resetBoardUpdateStore,
      setSessionState,
      getSessionState,
    ]
  );

  return logout;
};
