import { userApi, type User } from '@/shared/api/user/userApi';
import { mutationKeys, queryKeys } from '@/shared/config/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCanCreateUser } from './guards';
import { useCallback } from 'react';

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  const canCreateUser = useCanCreateUser();

  const {
    mutateAsync,
    isPending: isRegistering,
    error: registrationError,
  } = useMutation({
    mutationKey: mutationKeys.createUser,
    mutationFn: async (userDraft: { name: string; avatarId: string }) => {
      const newUser = (await userApi.registerUser({ userDraft })).data;

      const prevData = queryClient.getQueryData<User[]>(queryKeys.users);
      queryClient.setQueryData(queryKeys.users, prevData ? [...prevData, newUser] : [newUser]);
      return newUser;
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });

  const registerUser = useCallback(
    (userDraft: { name: string; avatarId: string }) => {
      if (!canCreateUser) {
        return;
      }

      return mutateAsync(userDraft);
    },
    [mutateAsync, canCreateUser]
  );

  return {
    registerUser,
    isRegistering,
    registrationError,
    canCreateUser,
  };
};
