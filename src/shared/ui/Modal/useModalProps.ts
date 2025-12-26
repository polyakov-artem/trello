import { useCallback, useState } from 'react';

export type ModalProps<T> = {
  openModal: (details?: T) => void;
  closeModal: () => void;
  isOpen: boolean;
  details: T | undefined;
  onCloseComplete: () => void;
};

export const useModalProps = <T>(initialDetails?: T): ModalProps<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState<T | undefined>(initialDetails);

  const openModal = useCallback((details?: T) => {
    if (details) {
      setDetails(details);
    }

    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onCloseComplete = useCallback(() => {
    setDetails(initialDetails);
  }, [initialDetails]);

  return {
    openModal,
    closeModal,
    isOpen,
    details,
    onCloseComplete,
  };
};
