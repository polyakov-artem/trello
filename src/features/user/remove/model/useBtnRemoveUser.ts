import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useRemoveUser } from './useRemoveUser';

export const useBtnRemoveUser = (userId: string) => {
  const removeUser = useRemoveUser();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    void removeUser(userId).then((result) => {
      if (result && !result.ok) {
        toast.error(result.error.message);
      }
      setIsRemoving(false);
    });
  }, [userId, removeUser]);

  return useMemo(
    () => ({
      isRemoving,
      handleRemove,
    }),
    [isRemoving, handleRemove]
  );
};
