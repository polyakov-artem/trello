import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTaskUpdateStore, useTasksStore } from '@/entities/task';
import { useUpdateTask } from './useUpdateTask';
import { type CheckboxChangeEvent } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEditTaskContext } from './EditTaskContext';
import { useCanUpdateTask } from './guards';

export const TASK_NOT_FOUND = 'Task not found';

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

export const useModalEditTask = () => {
  const { closeModal, details, isOpen, onCloseComplete } = useEditTaskContext();
  const detailsTaskId = details?.taskId ?? '';

  const [formError, setFormError] = useState('');
  const updateTask = useUpdateTask();

  const processing = useTaskUpdateStore.use.isLoading();
  const tasks = useTasksStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const tasksError = useTasksStore.use.error();

  const { task, taskErrorMsg } = useMemo(() => {
    const foundTask = tasks?.find((task) => task.id === detailsTaskId);

    return {
      task: foundTask,
      taskErrorMsg: tasks && !foundTask ? TASK_NOT_FOUND : undefined,
    };
  }, [detailsTaskId, tasks]);

  const foundTaskId = task?.id || '';
  const canUpdateTask = useCanUpdateTask();

  const handleCloseModal = useCallback(() => {
    setFormError('');
    closeModal();
  }, [closeModal]);

  const formik = useFormik({
    initialValues: defaultFormState,
    validationSchema: schema,
    onSubmit: async (values) => {
      const result = await updateTask(foundTaskId, values, () => setFormError(''));

      if (result) {
        if (result?.ok === false) {
          setFormError(result.error.message);
        } else {
          handleCloseModal();
        }
      }
    },
  });

  const { setValues, resetForm } = formik;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        void setValues({
          title: task.title,
          description: task.description,
          completed: task.completed,
        });
      }
    } else {
      void resetForm();
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

  const handleSubmitBtnClick = useCallback(() => formik.handleSubmit(), [formik]);

  const isLoading = isLoadingTasks;
  const depsErrorMsg = tasksError?.message || taskErrorMsg;

  useEffect(() => {
    if (isOpen && depsErrorMsg) {
      setFormError(depsErrorMsg);
    }
  }, [depsErrorMsg, isOpen]);

  const isFormDisabled = !canUpdateTask || isLoading || processing;

  return useMemo(
    () => ({
      processing,
      isLoading,
      closeModal: handleCloseModal,
      isOpen,
      isFormDisabled,
      onCloseComplete,
      formError,
      titleError: formik.errors.title && formik.touched.title ? formik.errors.title : '',
      values: formik.values,
      handleInputChange,
      handleCheckboxChange,
      handleSubmit: formik.handleSubmit,
      handleSubmitBtnClick,
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
      isLoading,
      isOpen,
      onCloseComplete,
      processing,
    ]
  );
};
