import { toast } from 'react-toastify';
import { useCallback, useMemo, useState } from 'react';
import { useLoginWithUserId } from '@/features/auth/login';
import { useLogout } from '@/features/auth/logout';
import { useLoadSessionUser } from '@/features/user/load';
import { useLoadTasks } from '@/features/task/load';
import { useLoadBoards } from '@/features/board/load';

export const useBtnLogin = (userId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const logout = useLogout();
  const loginWithUserId = useLoginWithUserId();
  const loadSessionUser = useLoadSessionUser();
  const loadTasks = useLoadTasks();
  const loadBoards = useLoadBoards();

  const handleClick = useCallback(() => {
    setIsLoading(true);

    void logout()
      .then(() => loginWithUserId(userId))
      .then((result) => {
        if (result) {
          if (result.ok) {
            void loadSessionUser();
            void loadTasks();
            void loadBoards();
          } else {
            toast.error(result.error.message);
          }
        }

        setIsLoading(false);
      });
  }, [loadBoards, loadSessionUser, loadTasks, loginWithUserId, logout, userId]);

  return useMemo(() => ({ isLoading, handleClick }), [isLoading, handleClick]);
};
