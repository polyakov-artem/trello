import { useUsersStore } from '@/entities/user/model/usersStore';
import { userApi } from '@/shared/api/user/userApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useLoadUsers = () => {
  const setUsers = useUsersStore.use.setUsers();
  const setIsLoadingUsers = useUsersStore.use.setIsLoadingUsers();
  const setUsersLoadingError = useUsersStore.use.setUsersLoadingError();
  const getState = useUsersStore.getState;

  const loadUsers = useCallback(
    async (throwError?: boolean) => {
      if (getState().isLoadingUsers) {
        return;
      }
      setIsLoadingUsers(true);

      try {
        const users = await userApi.getUsers(throwError);
        setUsers(users);
      } catch (error) {
        setUsersLoadingError(getErrorMessage(error));
      } finally {
        setIsLoadingUsers(false);
      }
    },

    [getState, setIsLoadingUsers, setUsers, setUsersLoadingError]
  );

  return { loadUsers };
};
