import { type FC, type PropsWithChildren } from 'react';
import Modal from '../Modal/Modal';
import { Button } from 'antd';
import { useConfirmationContext } from './ConfirmationContext';

export const Confirmation: FC<PropsWithChildren> = () => {
  const { details, isOpen, closeModal, confirm, onCloseComplete } = useConfirmationContext();

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title={details?.title}
      body={details?.body}
      onCloseComplete={onCloseComplete}
      buttons={
        <>
          <Button color="red" variant="solid" onClick={confirm}>
            Confirm
          </Button>
          <Button color="default" variant="solid" onClick={closeModal}>
            Cancel
          </Button>
        </>
      }
    />
  );
};
