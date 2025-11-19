import { useCallback, useState } from 'react';
import { useLogout } from '@/features/auth/logout';
import { useRemoveUser } from '@/features/user/remove';
import { toast } from 'react-toastify';

export const useBtnRemoveUser = (userId: string) => {
  const { logout } = useLogout();
  const { removeUser } = useRemoveUser();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    void removeUser(userId, logout).then((result) => {
      if (result && !result.ok) {
        toast.error(result.error.message);
      }
      setIsRemoving(false);
    });
  }, [userId, logout, removeUser]);

  return {
    isRemoving,
    handleRemove,
  };
};
