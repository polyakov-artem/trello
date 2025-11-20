import { useCallback, useMemo, useRef, useState, type FC, type PropsWithChildren } from 'react';
import { useModal } from '../Modal/useModal';
import Modal from '../Modal/Modal';
import { Button } from 'antd';
import { ConfirmationContext } from './ConfirmationContext';

export type ModalProps = {
  title?: string;
  body?: React.ReactNode;
};

export type getConfirmation = (params: ModalProps) => Promise<boolean>;
export type Resolve = (value: boolean) => void;

export const Confirmation: FC<PropsWithChildren> = ({ children }) => {
  const { openModal, closeModal, isOpen } = useModal();
  const [modalProps, setModalProps] = useState<ModalProps>({});
  const resolveRef = useRef<Resolve | null>(null);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    closeModal();
  }, [closeModal]);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    closeModal();
  }, [closeModal]);

  const getConfirmation: getConfirmation = useCallback(
    ({ title, body }) => {
      return new Promise((resolve) => {
        setModalProps({ title, body });
        resolveRef.current = resolve;
        openModal();
      });
    },
    [openModal]
  );

  const contextValue = useMemo(() => ({ getConfirmation }), [getConfirmation]);

  return (
    <ConfirmationContext value={contextValue}>
      {children}
      <Modal
        {...modalProps}
        isOpen={isOpen}
        closeModal={handleCancel}
        buttons={
          <>
            <Button color="red" variant="solid" onClick={handleConfirm}>
              Confirm
            </Button>
            <Button color="default" variant="solid" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        }
      />
    </ConfirmationContext>
  );
};
