import { useCallback, useMemo, useState } from 'react';
import { type CheckboxChangeEvent } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCreateColumnTaskContext } from './CreateColumnTaskContext';
import { useCreateColumnTask } from './useCreateColumnTask';

export const defaultFormState = {
  title: '',
  description: '',
  completed: false,
};

const schema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(50, 'Title must be no longer than 50 characters')
    .required('Title is required'),
});

export const useModalCreateColumnTask = () => {
  const [formError, setFormError] = useState('');
  const { closeModal, isOpen, details } = useCreateColumnTaskContext();
  const { columnId = '' } = details || {};
  const { createColumnTask, isCreatingColumnTask, canCreateColumnTask } = useCreateColumnTask();
  const isFormDisabled = !canCreateColumnTask;

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setFormError('');
        await createColumnTask({
          taskDraft: values,
          columnId,
        });
        handleCloseModal();
      } catch (e) {
        if (e instanceof Error) {
          setFormError(e.message);
        }
      }
    },
  });

  const { resetForm, values, handleSubmit, touched, errors, setFieldValue } = formik;

  const handleCloseModal = useCallback(() => {
    setFormError('');
    closeModal();
    resetForm();
  }, [closeModal, resetForm]);

  const handleFieldChange = useCallback(
    (name: string, value: string[] | string | boolean) => {
      setFormError('');
      void setFieldValue(name, value);
    },
    [setFieldValue]
  );

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

  const handleSubmitBtnClick = useCallback(() => handleSubmit(), [handleSubmit]);

  return useMemo(
    () => ({
      values,
      titleError: touched.title && errors.title ? errors.title : '',
      formError,
      handleInputChange,
      handleCheckboxChange,
      handleSubmit: handleSubmit,
      handleSubmitBtnClick,
      closeModal: handleCloseModal,
      isFormDisabled,
      isOpen,
      isCreatingColumnTask,
    }),
    [
      errors.title,
      formError,
      handleCheckboxChange,
      handleCloseModal,
      handleInputChange,
      handleSubmit,
      handleSubmitBtnClick,
      isCreatingColumnTask,
      isFormDisabled,
      isOpen,
      touched.title,
      values,
    ]
  );
};
