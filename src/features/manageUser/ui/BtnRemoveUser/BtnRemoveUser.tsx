import type { PropsWithClassName } from '@/shared/types/types';
import { Button } from 'antd';
import { useCallback, type FC } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { useRemoveUser } from '../../model/useRemoveUser';
import { useUsersStore } from '@/entities/user/model/usersStore';
import { toast } from 'react-toastify';

export type BtnRemoveUserProps = { id: string } & PropsWithClassName;

export const MSG_CONFIRM_REMOVE_USER = 'Are you sure you want to remove this user?';
export const MSG_USER_REMOVED_SUCCESSFULLY = 'User removed successfully';

export const BtnRemoveUser: FC<BtnRemoveUserProps> = ({ className, id }) => {
  const { removeUser } = useRemoveUser();
  const deletionQueue = useUsersStore.use.deletionQueue();
  const isRemoving = deletionQueue[id];

  const handleRemove = useCallback(() => {
    void (async () => {
      const result = await removeUser(id);
      if (!result) {
        return;
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(MSG_USER_REMOVED_SUCCESSFULLY);
      }
    })();
  }, [id, removeUser]);

  return (
    <>
      <Button
        loading={isRemoving}
        onClick={handleRemove}
        color="danger"
        variant="solid"
        shape="circle"
        icon={<DeleteOutlined />}
        className={className}
        aria-label="Remove user"
      />
    </>
  );
};
