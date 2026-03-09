import { Button } from 'antd';
import { useCallback, useState, type FC } from 'react';
import { useCanLogout } from '../model/guards';
import { useLogout } from '../model/useLogout';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnLogoutProps = Omit<BaseButtonProps, 'onClick' | 'loading' | 'disabled'> & {
  forcibly?: boolean;
};

export const BtnLogout: FC<BtnLogoutProps> = ({ forcibly, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const canLogout = useCanLogout();

  const logout = useLogout();

  const logoutHandler = useCallback(async () => {
    await logout(
      () => setIsLoading(true),
      () => setIsLoading(false),
      forcibly
    );
  }, [logout, forcibly]);

  const handleClick = useCallback(() => {
    void logoutHandler();
  }, [logoutHandler]);

  const disabled = isLoading || (!forcibly && !canLogout) ? true : false;

  return (
    <>
      <Button
        color="default"
        variant="solid"
        iconPosition={'end'}
        {...props}
        disabled={disabled}
        loading={isLoading}
        onClick={handleClick}
      />
    </>
  );
};
