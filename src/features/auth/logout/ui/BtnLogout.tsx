import { Button } from 'antd';
import { type FC } from 'react';
import { useLogout } from '../model/useLogout';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnLogoutProps = Omit<BaseButtonProps, 'onClick' | 'loading' | 'disabled'>;

export const BtnLogout: FC<BtnLogoutProps> = ({ ...props }) => {
  const { logout, isLoggingOut, canLogout } = useLogout();

  return (
    <>
      <Button
        color="default"
        variant="solid"
        iconPosition={'end'}
        {...props}
        disabled={!canLogout}
        loading={isLoggingOut}
        onClick={() => {
          void logout({ initiatedByUser: true });
        }}
      />
    </>
  );
};
