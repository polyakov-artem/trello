import {
  useBoardCreationStore,
  useBoardDeletionStore,
  useBoardsStore,
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

export const useLogout = () => {
  const setSessionState = useSessionStore.use.setState();
  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();

  const resetSessionStore = useSessionStore.use.reset();
  const resetSessionUserStore = useSessionUserStore.use.reset();

  const resetTasksStore = useTasksStore.use.reset();
  const resetTaskCreationStore = useTaskCreationStore.use.reset();
  const resetTaskDeletionStore = useTaskDeletionStore.use.reset();
  const resetTaskUpdateStore = useTaskUpdateStore.use.reset();

  const resetBoardsStore = useBoardsStore.use.reset();
  const resetBoardCreationStore = useBoardCreationStore.use.reset();
  const resetBoardDeletionStore = useBoardDeletionStore.use.reset();
  const resetBoardUpdateStore = useBoardUpdateStore.use.reset();

  const logout = useCallback(async () => {
    const sessionId = getSession()?.sessionId || '';

    if (checkIfLoadingSession() || !sessionId) {
      return;
    }

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
    await authApi.logout(sessionId);
    await sessionRepository.removeSession();
    setSessionState({ isLoading: false });
    return { success: true };
  }, [
    checkIfLoadingSession,
    getSession,
    resetBoardCreationStore,
    resetBoardDeletionStore,
    resetBoardUpdateStore,
    resetBoardsStore,
    resetSessionStore,
    resetSessionUserStore,
    resetTaskCreationStore,
    resetTaskDeletionStore,
    resetTaskUpdateStore,
    resetTasksStore,
    setSessionState,
  ]);

  return logout;
};
