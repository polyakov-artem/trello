import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { type FC } from 'react';
import { useBtnLogout } from '../model/useBtnLogout';

export type BtnLogoutProps = PropsWithClassName;

export const BtnLogout: FC<BtnLogoutProps> = ({ className }) => {
  const { isLoading, handleClick, isBtnDisabled } = useBtnLogout();

  return (
    <>
      <Button
        disabled={isBtnDisabled}
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
