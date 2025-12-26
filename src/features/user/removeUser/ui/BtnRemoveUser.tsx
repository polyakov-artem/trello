import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { type FC } from 'react';
import { useBtnRemoveUser } from '../model/useBtnRemoveUser';

export type BtnRemoveUserProps = { id: string } & PropsWithClassName;

export const MSG_CONFIRM_REMOVE_USER = 'Are you sure you want to remove this user?';

export const BtnRemoveUser: FC<BtnRemoveUserProps> = ({ className, id }) => {
  const { isRemoving, handleClick, isBtnDisabled } = useBtnRemoveUser(id);

  return (
    <>
      <Button
        disabled={isBtnDisabled}
        loading={isRemoving}
        onClick={handleClick}
        color="danger"
        variant="solid"
        iconPosition="end"
        className={className}>
        Delete
      </Button>
    </>
  );
};
