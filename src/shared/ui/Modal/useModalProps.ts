import { useCallback, useState } from 'react';

export const useModalProps = <T>(initialDetails?: T) => {
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
