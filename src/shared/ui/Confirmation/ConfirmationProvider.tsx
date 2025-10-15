import { useCallback, useMemo, useState, type FC, type PropsWithChildren } from 'react';
import { useModal } from '../Modal/useModal';
import Modal from '../Modal/Modal';
import { Button } from 'antd';
import { ConfirmationContext } from './useConfirmation';

export type ModalProps = {
  title?: string;
  body?: React.ReactNode;
};

export type getConfirmation = (params: ModalProps) => Promise<boolean>;
export type ResolveObj = { resolve: (value: boolean) => void };

export const ConfirmationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { openModal, closeModal, isOpen } = useModal();
  const [modalProps, setModalProps] = useState<ModalProps>({});
  const [resolveObj, setResolveObj] = useState<ResolveObj | undefined>();

  const handleConfirm = useCallback(() => {
    resolveObj?.resolve(true);
    closeModal();
  }, [resolveObj, closeModal]);

  const handleCancel = useCallback(() => {
    resolveObj?.resolve(false);
    closeModal();
  }, [resolveObj, closeModal]);

  const getConfirmation: getConfirmation = useCallback(
    ({ title, body }) => {
      return new Promise((resolve) => {
        setModalProps({ title, body });
        setResolveObj({ resolve });
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
