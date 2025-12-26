import { useSessionStore } from '@/entities/session';
import { useUserDeletionStore, useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { useCallback } from 'react';
import { useRemoveUserContext } from './RemoveUserContext';
import { useCanRemoveUserFn } from './guards';

export const useRemoveUser = () => {
  const setUsers = useUsersStore.use.setState();
  const setUserRemovingState = useUserDeletionStore.use.setState();
  const getSessionStoreState = useSessionStore.use.getState();
  const canRemoveUserFn = useCanRemoveUserFn();

  const { logout } = useRemoveUserContext();

  const removeUser = useCallback(
    async (userId: string, onStart?: () => void, onEnd?: () => void) => {
      if (!canRemoveUserFn()) {
        return;
      }

      onStart?.();

      setUserRemovingState({ isLoading: true, error: undefined });

      const sessionId = getSessionStoreState().value?.sessionId || '';
      const result = await userApi.removeUser(userId, sessionId);

      if (result.ok) {
        await logout();
        setUsers((prevState) => {
          return { value: prevState.value?.filter((user) => user.id !== userId) };
        });
      }

      setUserRemovingState({ isLoading: false });

      onEnd?.();
      return result;
    },
    [canRemoveUserFn, setUserRemovingState, getSessionStoreState, logout, setUsers]
  );

  return removeUser;
};
