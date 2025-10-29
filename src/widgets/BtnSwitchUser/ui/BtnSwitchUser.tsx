import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, useState, type FC } from 'react';
import { useSessionStore } from '@/entities/session';
import { useLoginWithUserId, useLogout, useSwitchUser } from '@/features/auth';
import { toast } from 'react-toastify';

export type BtnSwitchUserProps = { id: string } & PropsWithClassName;

export const BtnSwitchUser: FC<BtnSwitchUserProps> = ({ className, id }) => {
  const session = useSessionStore.use.session();
  const isAlreadyLoggedIn = session?.userId === id;
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = isAlreadyLoggedIn;

  const { logout } = useLogout();
  const { loginWithUserId } = useLoginWithUserId();
  const { switchUser } = useSwitchUser();

  const handleSwitchUser = useCallback(() => {
    setIsLoading(true);
    void switchUser({ id, logout, loginWithUserId })
      .then((result) => {
        if (result?.error) {
          toast.error(result.error);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id, loginWithUserId, logout, switchUser]);

  return (
    <>
      <Button
        loading={isLoading}
        disabled={isDisabled}
        onClick={handleSwitchUser}
        color="green"
        variant="solid"
        className={className}
        iconPosition={'end'}>
        Log in
      </Button>
    </>
  );
};
