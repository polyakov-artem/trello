import { useCallback, useRef, useState } from 'react';
import { useTaskCreationStore } from '@/entities/task';
import { useCreateTask } from '@/features/task/create';
import { useSessionStore } from '@/entities/session';
import { type CheckboxChangeEvent } from 'antd';

export type UseModalCreateTaskProps = {
  closeModal: () => void;
};

export const initialFormValues = {
  title: '',
  description: '',
  completed: false,
};

export const useModalCreateTask = ({ closeModal }: UseModalCreateTaskProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFromValues] = useState(initialFormValues);
  const [formError, setFormError] = useState('');
  const { createTask } = useCreateTask();

  const checkIfCreatingTask = useTaskCreationStore.use.checkIfLoading();
  const isCreatingTask = useTaskCreationStore.use.isLoading();

  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const sessionError = useSessionStore.use.error();

  const isLoadingDeps = isLoadingSession;
  const depsError = sessionError;

  const isCreateBtnDisabled = isCreatingTask;
  const isCancelBtnDisabled = isCreatingTask;

  const checkIfSubmitProhibited = useCallback(() => checkIfCreatingTask(), [checkIfCreatingTask]);

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

  const handleCheckboxChange = useCallback(
    (e: CheckboxChangeEvent) => {
      handleFieldChange(e.target.name || '', e.target.checked);
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

      void createTask(formValues).then((result) => {
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
    [checkIfSubmitProhibited, createTask, formValues, handleCloseModal]
  );

  const handleCreateBtnClick = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return {
    formRef,
    isCreatingTask,
    session,
    formValues,
    formError,
    isCreateBtnDisabled,
    isCancelBtnDisabled,
    isLoadingDeps,
    depsError,
    handleFieldChange,
    handleCheckboxChange,
    handleInputChange,
    handleCloseModal,
    handleSubmit,
    handleCreateBtnClick,
  };
};
