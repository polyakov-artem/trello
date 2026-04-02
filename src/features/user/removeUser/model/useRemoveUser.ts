import {
  useAuthStoreActions,
  useLogoutContext,
  useSessionId,
  useSessionUserId,
} from '@/entities/session';
import { userApi } from '@/shared/api/user/userApi';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCanRemoveUser } from './guards';
import { mutationKeys, queryKeys } from '@/shared/config/queries';

export const useRemoveUser = (userId: string) => {
  const sessionId = useSessionId();
  const sessionUserId = useSessionUserId();

  const queryClient = useQueryClient();
  const canRemoveUser = useCanRemoveUser(userId);
  const { setIsLoadingSession } = useAuthStoreActions();
  const { logout } = useLogoutContext();
  const isLoggedIn = sessionUserId === userId;

  const { mutateAsync, isPending: isRemovingUser } = useMutation({
    mutationKey: mutationKeys.deleteUser({ userId, sessionId }),
    mutationFn: async () => {
      if (!isLoggedIn) {
        await userApi.removeUser({ id: userId, sessionId });
        return;
      }

      setIsLoadingSession(true);

      try {
        await userApi.removeUser({ id: userId, sessionId });
        await logout({ initiatedByUser: false });
      } finally {
        setIsLoadingSession(false);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });

  const removeUser = useCallback(async () => {
    if (!canRemoveUser) {
      return;
    }

    return await mutateAsync();
  }, [canRemoveUser, mutateAsync]);

  return { removeUser, isRemovingUser, canRemoveUser };
};
