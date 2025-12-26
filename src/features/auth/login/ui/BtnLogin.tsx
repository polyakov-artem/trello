import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { type FC } from 'react';
import { useBtnLogin } from '../model/useBtnLogin';

export type BtnLoginProps = { userId: string } & PropsWithClassName;

export const BtnLogin: FC<BtnLoginProps> = ({ className, userId }) => {
  const { isLoading, handleClick, isBtnDisabled } = useBtnLogin(userId);

  return (
    <>
      <Button
        disabled={isBtnDisabled}
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
