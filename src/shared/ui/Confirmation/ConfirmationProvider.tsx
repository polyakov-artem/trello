import { useCallback, useMemo, useRef, type FC, type PropsWithChildren } from 'react';
import { useModalProps } from '../Modal/useModalProps';
import { ConfirmationContext, type Details, type GetConfirmation } from './ConfirmationContext';

export type Resolve = (value: boolean) => void;

const defaultDetails = {
  title: 'Please confirm action',
};

export const ConfirmationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { openModal, closeModal, isOpen, details, onCloseComplete } =
    useModalProps<Details>(defaultDetails);

  const resolveRef = useRef<Resolve | null>(null);

  const confirm = useCallback(() => {
    resolveRef.current?.(true);
    closeModal();
  }, [closeModal]);

  const handleClose = useCallback(() => {
    resolveRef.current?.(false);
    closeModal();
  }, [closeModal]);

  const getConfirmation: GetConfirmation = useCallback(
    (props) => {
      return new Promise((resolve) => {
        resolveRef.current = resolve;
        openModal(props);
      });
    },
    [openModal]
  );

  const value = useMemo(
    () => ({
      details,
      isOpen,
      closeModal: handleClose,
      confirm,
      getConfirmation,
      onCloseComplete,
    }),
    [confirm, details, getConfirmation, handleClose, isOpen, onCloseComplete]
  );

  return <ConfirmationContext value={value}>{children}</ConfirmationContext>;
};
