import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, useState, type FC } from 'react';
import { useLoginWithUserId, useLogout } from '@/features/auth';
import { toast } from 'react-toastify';
import { useLoadSessionUser } from '@/features/manageUser';
import { useLoadTasks } from '@/features/task/view';

export type BtnLoginProps = { userId: string } & PropsWithClassName;

export const BtnLogin: FC<BtnLoginProps> = ({ className, userId }) => {
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

  return (
    <>
      <Button
        loading={isLoading}
        onClick={handleClick}
        color="green"
        variant="solid"
        className={className}
        iconPosition={'end'}>
        Log in
      </Button>
    </>
  );
};
