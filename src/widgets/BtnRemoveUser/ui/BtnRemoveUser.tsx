import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { useUsersStore } from '@/entities/user';
import { useLogout } from '@/features/auth';
import { useRemoveUser } from '@/features/manageUser';
import { toast } from 'react-toastify';

export type BtnRemoveUserProps = { id: string } & PropsWithClassName;

export const MSG_CONFIRM_REMOVE_USER = 'Are you sure you want to remove this user?';

export const BtnRemoveUser: FC<BtnRemoveUserProps> = ({ className, id }) => {
  const { logout } = useLogout();
  const { removeUser } = useRemoveUser();
  const deletionQueue = useUsersStore.use.deletionQueue();
  const isRemoving = deletionQueue[id];

  const handleRemove = useCallback(() => {
    void removeUser(id, logout).then((result) => {
      if (result && !result.ok) {
        toast.error(result.error.message);
      }
    });
  }, [id, logout, removeUser]);

  return (
    <>
      <Button
        loading={isRemoving}
        onClick={handleRemove}
        color="danger"
        variant="solid"
        iconPosition="end"
        className={className}>
        Delete
      </Button>
    </>
  );
};
