import { useCallback, useMemo, useRef, useState } from 'react';
import { useBoardCreationStore } from '@/entities/board';
import { useCreateBoard } from './useCreateBoard';
import { useSessionStore } from '@/entities/session';

export type UseModalCreateBoardProps = {
  closeModal: () => void;
};

export const initialFormValues = {
  title: '',
};

export const useModalCreateBoard = ({ closeModal }: UseModalCreateBoardProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFromValues] = useState(initialFormValues);
  const [formError, setFormError] = useState('');
  const createBoard = useCreateBoard();

  const checkIfCreatingBoard = useBoardCreationStore.use.checkIfLoading();
  const isCreatingBoard = useBoardCreationStore.use.isLoading();

  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const sessionError = useSessionStore.use.error();

  const isLoadingDeps = isLoadingSession;
  const depsError = sessionError;

  const isCreateBtnDisabled = isCreatingBoard;
  const isCancelBtnDisabled = isCreatingBoard;

  const checkIfSubmitProhibited = useCallback(() => checkIfCreatingBoard(), [checkIfCreatingBoard]);

  const handleFieldChange = useCallback((name: string, value: string[] | string | boolean) => {
    setFormError('');
    setFromValues((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      handleFieldChange(e.target.name, e.target.value);
    },
    [handleFieldChange]
  );

  const handleCloseModal = useCallback(() => {
    setFromValues(initialFormValues);
    setFormError('');
    closeModal();
  }, [closeModal]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      if (checkIfSubmitProhibited()) return;

      setFormError('');

      void createBoard(formValues).then((result) => {
        if (!result) {
          return;
        }

        if (result.ok === false) {
          setFormError(result.error.message);
        } else {
          handleCloseModal();
        }
      });
    },
    [checkIfSubmitProhibited, createBoard, formValues, handleCloseModal]
  );

  const handleCreateBtnClick = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return useMemo(
    () => ({
      formRef,
      isCreatingBoard,
      session,
      formValues,
      formError,
      isCreateBtnDisabled,
      isCancelBtnDisabled,
      isLoadingDeps,
      depsError,
      handleInputChange,
      handleCloseModal,
      handleSubmit,
      handleCreateBtnClick,
    }),
    [
      depsError,
      formError,
      formValues,
      handleCloseModal,
      handleCreateBtnClick,
      handleInputChange,
      handleSubmit,
      isCancelBtnDisabled,
      isCreateBtnDisabled,
      isCreatingBoard,
      isLoadingDeps,
      session,
    ]
  );
};
