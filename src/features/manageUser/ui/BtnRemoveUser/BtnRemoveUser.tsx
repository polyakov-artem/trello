import type { PropsWithClassName } from '@/shared/types/types';
import { Button, Modal } from 'antd';
import { useCallback, useState, type FC } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { useRemoveUser } from '../../model/useRemoveUser';
import { useUsersStore } from '@/entities/user/model/usersStore';
import { toast } from 'react-toastify';

export type BtnRemoveUserProps = { id: string } & PropsWithClassName;

export const BtnRemoveUser: FC<BtnRemoveUserProps> = ({ className, id }) => {
  const { removeUser } = useRemoveUser();
  const deletionQueue = useUsersStore.use.deletionQueue();
  const isRemoving = deletionQueue[id];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    setIsModalOpen(false);
    void (async () => {
      const result = await removeUser(id);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('User removed successfully');
      }
    })();
  }, [id, removeUser]);

  return (
    <>
      <Button
        loading={isRemoving}
        onClick={showModal}
        color="danger"
        variant="solid"
        shape="circle"
        icon={<DeleteOutlined />}
        className={className}
        aria-label="Remove user"
      />
      <Modal
        title="Confirm Removal"
        open={isModalOpen}
        onOk={handleConfirmRemove}
        onCancel={handleCancel}
        okText="Remove"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}>
        <p>Are you sure you want to remove this user? This action cannot be undone.</p>
      </Modal>
    </>
  );
};
