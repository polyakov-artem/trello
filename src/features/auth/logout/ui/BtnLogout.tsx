import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, useState, type FC } from 'react';
import { useLogout } from '../model/useLogout';

export type BtnLogoutProps = PropsWithClassName;

export const BtnLogout: FC<BtnLogoutProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const logout = useLogout();

  const handleClick = useCallback(() => {
    setIsLoading(true);
    void logout().finally(() => setIsLoading(false));
  }, [logout]);

  return (
    <>
      <Button
        loading={isLoading}
        onClick={handleClick}
        color="default"
        variant="solid"
        className={className}
        iconPosition={'end'}>
        Log out
      </Button>
    </>
  );
};
