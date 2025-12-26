import { useUserCreationStore, useUsersStore } from '@/entities/user';
import { userApi } from '@/shared/api/user/userApi';
import type { UserWithoutId } from '@/shared/api/user/userApi';
import { useCallback } from 'react';
import { useCanCreateUserFn } from './guards';

export const useRegisterUser = () => {
  const setUsersState = useUsersStore.use.setState();
  const setUserCreationState = useUserCreationStore.use.setState();
  const canCreateUserFn = useCanCreateUserFn();

  const registerUser = useCallback(
    async (user: UserWithoutId, onStart?: () => void, onEnd?: () => void) => {
      if (!canCreateUserFn()) {
        return;
      }

      onStart?.();

      setUserCreationState({ isLoading: true, error: undefined });
      const result = await userApi.registerUser(user);

      if (result.ok) {
        setUsersState((prevState) => {
          return {
            value: [...(prevState?.value || []), result.data],
          };
        });
      } else {
        setUsersState({ error: result.error });
      }

      setUserCreationState({ isLoading: false });

      onEnd?.();
      return result;
    },
    [canCreateUserFn, setUserCreationState, setUsersState]
  );

  return registerUser;
};
