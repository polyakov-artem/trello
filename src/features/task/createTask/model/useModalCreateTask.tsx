import { useMemo } from 'react';
import { useCreateTask } from './useCreateTask';

import type { ModalCreateTaskProps } from '@/entities/task/ui/BaseModalCreateTask';
import { useCanCreateTask } from './guards';
import {
  useBaseModalCreateTask,
  useCreateTaskContext,
  useTaskCreationStore,
} from '@/entities/task';

export const useModalCreateTask = (): ModalCreateTaskProps => {
  const { closeModal, isOpen } = useCreateTaskContext();
  const createTask = useCreateTask();
  const isProcessing = useTaskCreationStore.use.isLoading();
  const isFormDisabled = !useCanCreateTask();

  const baseProps = useBaseModalCreateTask(createTask, closeModal, isOpen);

  return useMemo(
    () => ({ ...baseProps, isProcessing, isFormDisabled, isOpen }),
    [baseProps, isFormDisabled, isOpen, isProcessing]
  );
};
