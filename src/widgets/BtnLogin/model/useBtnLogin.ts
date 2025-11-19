import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { useLoginWithUserId } from '@/features/auth/login';
import { useLogout } from '@/features/auth/logout';
import { useLoadSessionUser } from '@/features/user/view';
import { useLoadTasks } from '@/features/task/view';

export const useBtnLogin = (userId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const { logout } = useLogout();
  const { loginWithUserId } = useLoginWithUserId();
  const { loadSessionUser } = useLoadSessionUser();
  const { loadTasks } = useLoadTasks();

  const handleClick = useCallback(() => {
    setIsLoading(true);

    void logout()
      .then(() => loginWithUserId(userId))
      .then((result) => {
        if (result) {
          if (result.ok) {
            void loadSessionUser();
            void loadTasks();
          } else {
            toast.error(result.error.message);
          }
        }

        setIsLoading(false);
      });
  }, [loadSessionUser, loadTasks, loginWithUserId, logout, userId]);

  return { isLoading, handleClick };
};
