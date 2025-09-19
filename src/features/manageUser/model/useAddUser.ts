import { useUsersStore } from '@/entities/user/model/usersStore';
import { userApi, type UserWithoutId } from '@/shared/api/user/userApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCallback } from 'react';

export const useAddUser = () => {
  const addUserToStore = useUsersStore.use.addUser();
  const setIsAddingUser = useUsersStore.use.setIsAddingUser();
  const getState = useUsersStore.getState;

  const addUser = useCallback(
    async (user: UserWithoutId, throwError?: boolean) => {
      if (getState().isAddingUser) {
        return;
      }

      setIsAddingUser(true);

      try {
        const newUser = await userApi.addUser(user, throwError);
        addUserToStore(newUser);
      } catch (error) {
        return { error: getErrorMessage(error) };
      } finally {
        setIsAddingUser(false);
      }
    },
    [addUserToStore, getState, setIsAddingUser]
  );

  return { addUser };
};
