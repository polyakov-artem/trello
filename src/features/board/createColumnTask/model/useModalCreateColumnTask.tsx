import { useCallback, useEffect, useMemo, useState } from 'react';
import { type CheckboxChangeEvent } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCreateColumnTaskContext } from './CreateColumnTaskContext';
import { useCreateColumnTask } from './useCreateColumnTask';
import { useTaskCreationStore } from '@/entities/task';
import { useCanCreateColumnTask } from './guards';

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
  const { boardId, columnId } = details || {};
  const createTask = useCreateColumnTask();
  const isProcessing = useTaskCreationStore.use.isLoading();
  const isFormDisabled = !useCanCreateColumnTask();

  const handleCloseModal = useCallback(() => {
    setFormError('');
    closeModal();
  }, [closeModal]);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!boardId || !columnId) {
        return;
      }

      const result = await createTask({
        taskDraft: values,
        boardId,
        columnId,
        onStart: () => setFormError(''),
      });

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
      isFormDisabled,
      isOpen,
      isProcessing,
    }),
    [
      formError,
      formik.errors.title,
      formik.handleSubmit,
      formik.touched.title,
      formik.values,
      handleCheckboxChange,
      handleCloseModal,
      handleInputChange,
      handleSubmitBtnClick,
      isFormDisabled,
      isOpen,
      isProcessing,
    ]
  );
};
