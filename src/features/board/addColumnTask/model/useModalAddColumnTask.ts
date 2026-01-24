import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTaskCreationStore } from '@/entities/task';
import { type CheckboxChangeEvent } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCanAddColumnTask } from './guards';
import { useAddColumnTaskContext } from './AddColumnTaskContext';
import { useAddColumnTask } from './useAddColumnTask';

export const defaultFormState = {
  title: '',
  description: '',
  completed: false,
};

const schema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(20, 'Title must be no longer than 20 characters')
    .required('Title is required'),
});

export const useModalAddColumnTask = () => {
  const { closeModal, isOpen, details } = useAddColumnTaskContext();
  const [formError, setFormError] = useState('');
  const createTask = useAddColumnTask();
  const canCreateTask = useCanAddColumnTask();
  const isCreatingTask = useTaskCreationStore.use.isLoading();

  const handleCloseModal = useCallback(() => {
    setFormError('');
    closeModal();
  }, [closeModal]);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!details) {
        return;
      }

      const { board, column } = details;
      const result = await createTask(board, column, values, () => setFormError(''));

      if (result) {
        if (result?.ok === false) {
          setFormError(result.error.message);
        } else {
          handleCloseModal();
        }
      }
    },
  });

  const { resetForm } = formik;

  useEffect(() => {
    if (!isOpen) {
      void resetForm();
    }
  }, [isOpen, resetForm]);

  const handleFieldChange = useCallback(
    (name: string, value: string[] | string | boolean) => {
      setFormError('');
      void formik.setFieldValue(name, value);
    },
    [formik]
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

  const handleSubmitBtnClick = useCallback(() => formik.handleSubmit(), [formik]);

  return useMemo(
    () => ({
      values: formik.values,
      titleError: formik.touched.title && formik.errors.title ? formik.errors.title : '',
      formError,
      handleInputChange,
      handleCheckboxChange,
      handleSubmit: formik.handleSubmit,
      handleSubmitBtnClick,
      closeModal: handleCloseModal,
      isFormDisabled: !canCreateTask || !details,
      isCreatingTask,
      isOpen,
    }),
    [
      canCreateTask,
      details,
      formError,
      formik.errors.title,
      formik.handleSubmit,
      formik.touched.title,
      formik.values,
      handleCheckboxChange,
      handleCloseModal,
      handleInputChange,
      handleSubmitBtnClick,
      isCreatingTask,
      isOpen,
    ]
  );
};
