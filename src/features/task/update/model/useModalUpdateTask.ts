import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTaskUpdateStore, useTasksStore } from '@/entities/task';
import { useUpdateTask } from '@/features/task/update';
import { useSessionStore } from '@/entities/session';
import { type CheckboxChangeEvent } from 'antd';
import { errorNames, type FetchError } from '@/shared/lib/safeFetch';
import type { Task } from '@/shared/api/task/taskApi';

export type UseModalUpdateTaskProps = {
  closeModal: () => void;
  isOpen: boolean;
  taskId: string;
};

export const TASK_NOT_FOUND = 'Task not found';

export const defaultFormState = {
  title: '',
  description: '',
  completed: false,
};

export const useModalUpdateTask = ({ closeModal, isOpen, taskId }: UseModalUpdateTaskProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFromValues] = useState(defaultFormState);
  const [formError, setFormError] = useState('');
  const { updateTask } = useUpdateTask();

  const checkIfUpdatingTask = useTaskUpdateStore.use.checkIfLoading();
  const isUpdatingTask = useTaskUpdateStore.use.isLoading();

  const session = useSessionStore.use.value();
  const isLoadingSession = useSessionStore.use.isLoading();
  const sessionError = useSessionStore.use.error();

  const tasks = useTasksStore.use.value();
  const isLoadingTasks = useTasksStore.use.isLoading();
  const tasksError = useTasksStore.use.error();

  const { task, taskError } = useMemo(() => {
    const task = tasks.find((task) => task.id === taskId);
    const result: { task?: Task; taskError?: FetchError } = {
      task: undefined,
      taskError: undefined,
    };

    if (!isLoadingTasks) {
      if (!task) {
        result.taskError = {
          message: TASK_NOT_FOUND,
          name: errorNames.unknown,
        } satisfies FetchError;
      } else {
        result.task = task;
      }
    }

    return result;
  }, [tasks, isLoadingTasks, taskId]);

  useEffect(() => {
    if (task && isOpen) {
      setFromValues({
        title: task.title,
        description: task.description,
        completed: task.completed,
      });
    }
  }, [isOpen, task]);

  const isLoadingDeps = isLoadingSession || isLoadingTasks;
  const depsError = sessionError || tasksError || taskError;

  const isUpdateBtnDisabled = isUpdatingTask;
  const isCancelBtnDisabled = isUpdatingTask;

  const checkIfSubmitProhibited = useCallback(() => checkIfUpdatingTask(), [checkIfUpdatingTask]);

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
    setFromValues(defaultFormState);
    setFormError('');
    closeModal();
  }, [closeModal]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      if (checkIfSubmitProhibited()) return;

      setFormError('');

      void updateTask(taskId, formValues).then((result) => {
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
    [checkIfSubmitProhibited, formValues, handleCloseModal, taskId, updateTask]
  );

  const handleUpdateBtnClick = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return {
    formRef,
    isUpdatingTask,
    session,
    formValues,
    formError,
    isUpdateBtnDisabled,
    isCancelBtnDisabled,
    isLoadingDeps,
    depsError,
    handleFieldChange,
    handleCheckboxChange,
    handleInputChange,
    handleCloseModal,
    handleSubmit,
    handleUpdateBtnClick,
  };
};
