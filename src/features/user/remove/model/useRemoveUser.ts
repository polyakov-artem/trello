import { useSessionStore } from '@/entities/session';
import { useUserDeletionStore, useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { useConfirmationContext } from '@/shared/ui/Confirmation/ConfirmationContext';
import { useCallback } from 'react';
import { useRemoveUserDepsContext } from './RemoveUserDepsContext';

export const TITLE = 'Удаление пользователя';
export const TEXT = 'Вы действительно хотите удалить пользователя?';

export const useRemoveUser = () => {
  const setUsers = useUsersStore.use.setState();

  const checkIfRemovingUser = useUserDeletionStore.use.checkIfLoading();
  const setUserRemovingState = useUserDeletionStore.use.setState();

  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();
  const { getConfirmation } = useConfirmationContext();
  const logout = useRemoveUserDepsContext();

  const removeUser = useCallback(
    async (userId: string) => {
      const sessionId = getSession()?.sessionId || '';

      if (checkIfRemovingUser() || checkIfLoadingSession()) {
        return;
      }

      const confirmed = await getConfirmation({
        title: TITLE,
        body: TEXT,
      });

      if (!confirmed) {
        return;
      }

      setUserRemovingState({ isLoading: true, error: undefined });

      const result = await userApi.removeUser(userId, sessionId);

      if (result.ok) {
        await logout();
        setUsers((prevState) => {
          return { value: prevState.value.filter((user) => user.id !== userId) };
        });
      }

      setUserRemovingState({ isLoading: false });
      return result;
    },
    [
      getSession,
      checkIfRemovingUser,
      checkIfLoadingSession,
      getConfirmation,
      setUserRemovingState,
      logout,
      setUsers,
    ]
  );

  return removeUser;
};
