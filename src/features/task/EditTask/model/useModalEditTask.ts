import { useCallback, useEffect, useState } from 'react';
import { useEditTask } from './useEditTask';
import { type CheckboxChangeEvent } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEditTaskContext } from './EditTaskContext';
import { useTaskQuery } from '@/entities/task';

export const TASK_NOT_FOUND = 'Task not found';

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

export const useModalEditTask = () => {
  const { closeModal, details, isOpen, onCloseComplete } = useEditTaskContext();
  const [formError, setFormError] = useState('');
  const { taskId = '' } = details || {};
  const { taskError, isFetchingTask, task } = useTaskQuery(taskId);
  const { isUpdatingTask, updateTask, canEditTask } = useEditTask(taskId);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await updateTask(values);
        handleCloseModal();
      } catch (error) {
        if (error instanceof Error) {
          setFormError(error.message);
        }
      }
    },
  });

  const { setValues, resetForm, values, handleSubmit } = formik;

  const handleCloseModal = useCallback(() => {
    setFormError('');
    resetForm();
    closeModal();
  }, [closeModal, resetForm]);

  useEffect(() => {
    if (isOpen && task) {
      void setValues({
        title: task.title,
        description: task.description,
        completed: task.completed,
      });
    }
  }, [isOpen, setValues, resetForm, task]);

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

  return {
    taskError,
    isFetchingTask,
    isUpdatingTask,
    closeModal: handleCloseModal,
    isOpen,
    isFormDisabled: !canEditTask,
    onCloseComplete,
    formError,
    titleError: formik.errors.title && formik.touched.title ? formik.errors.title : '',
    values,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  };
};
