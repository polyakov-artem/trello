import { useUsersStore } from '@/entities/user';
import { userApi, type UserWithoutId } from '@/shared/api/user/userApi';
import { useCallback } from 'react';

export const useRegisterUser = () => {
  const addUserToStore = useUsersStore.use.addUser();
  const setCreationState = useUsersStore.use.setCreationState();
  const checkIfCreatingUser = useUsersStore.use.checkIfCreatingUser();

  const registerUser = useCallback(
    async (user: UserWithoutId) => {
      if (checkIfCreatingUser()) {
        return;
      }

      setCreationState(true);
      const result = await userApi.registerUser(user);

      if (result.ok) {
        addUserToStore(result.data);
      } else {
        setCreationState(result.error);
      }

      setCreationState(false);
      return result;
    },
    [addUserToStore, checkIfCreatingUser, setCreationState]
  );

  return { registerUser };
};
