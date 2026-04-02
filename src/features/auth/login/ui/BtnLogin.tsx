import { Button } from 'antd';
import { type FC } from 'react';
import { useLogin } from '../model/useLogin';
import { toast } from 'react-toastify';
import type { BaseButtonProps } from 'antd/es/button/button';

export type BtnLoginProps = Omit<BaseButtonProps, 'onClick' | 'loading' | 'disabled'> & {
  userId: string;
};

export const BtnLogin: FC<BtnLoginProps> = ({ userId, ...props }) => {
  const { login, isLoggingIn, canLogin } = useLogin(userId);

  const handleClick = () => {
    login().catch((e) => {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    });
  };

  return (
    <>
      <Button
        color="green"
        variant="solid"
        iconPosition={'end'}
        {...props}
        disabled={!canLogin}
        loading={isLoggingIn}
        onClick={handleClick}
      />
    </>
  );
};
