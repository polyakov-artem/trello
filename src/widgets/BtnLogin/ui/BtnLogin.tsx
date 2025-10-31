import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, useState, type FC } from 'react';
import { useLoginWithUserId, useLogout, useSwitchUser } from '@/features/auth';
import { toast } from 'react-toastify';

export type BtnLoginProps = { userId: string } & PropsWithClassName;

export const BtnLogin: FC<BtnLoginProps> = ({ className, userId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { logout } = useLogout();
  const { loginWithUserId } = useLoginWithUserId();
  const { switchUser } = useSwitchUser();

  const handleClick = useCallback(() => {
    setIsLoading(true);

    void switchUser({ userId, logout, loginWithUserId })
      .then((result) => {
        if (result && result.ok === false) {
          toast.error(result.error.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [loginWithUserId, logout, switchUser, userId]);

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
