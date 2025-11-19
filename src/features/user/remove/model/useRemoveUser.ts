import { useSessionStore } from '@/entities/session';

import { useUserDeletionStore, useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import { useConfirmation } from '@/shared/ui/Confirmation/useConfirmation';
import { useCallback } from 'react';

export const TITLE = 'Удаление пользователя';
export const TEXT = 'Вы действительно хотите удалить пользователя?';

export type LogOut = () => Promise<
  | {
      success: boolean;
    }
  | undefined
>;

export const useRemoveUser = () => {
  const setUsers = useUsersStore.use.setState();

  const checkIfRemovingUser = useUserDeletionStore.use.checkIfLoading();
  const setUserRemovingState = useUserDeletionStore.use.setState();

  const checkIfLoadingSession = useSessionStore.use.checkIfLoading();
  const getSession = useSessionStore.use.getValue();
  const { getConfirmation } = useConfirmation();

  const removeUser = useCallback(
    async (userId: string, logout: LogOut) => {
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
      checkIfRemovingUser,
      checkIfLoadingSession,
      getSession,
      getConfirmation,
      setUsers,
      setUserRemovingState,
    ]
  );

  return { removeUser };
};
