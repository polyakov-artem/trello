import { useCallback, useMemo } from 'react';
import type { ModalCreateTaskProps } from '@/entities/task/ui/BaseModalCreateTask';
import { useCanCreateColumnTask } from './guards';
import { useBaseModalCreateTask, useTaskCreationStore } from '@/entities/task';
import { useCreateColumnTask } from './useCreateColumnTask';
import { useCreateTaskContext } from '@/entities/task/model/CreateTaskContext';
import type { RequestFnProps } from '@/entities/task/model/useBaseModalCreateTask';

export const useModalCreateColumnTask = (): ModalCreateTaskProps => {
  const { closeModal, isOpen, details } = useCreateTaskContext();
  const createTask = useCreateColumnTask();
  const isProcessing = useTaskCreationStore.use.isLoading();
  const isFormDisabled = !useCanCreateColumnTask();

  const requestFn = useCallback(
    (requestFnProps: RequestFnProps) => {
      const { boardId, columnId } = details || {};

      if (!boardId || !columnId) {
        return Promise.resolve(undefined);
      }

      return createTask({ boardId, columnId, ...requestFnProps });
    },
    [createTask, details]
  );

  const baseProps = useBaseModalCreateTask(requestFn, closeModal, isOpen);

  return useMemo(
    () => ({ ...baseProps, isProcessing, isFormDisabled, isOpen }),
    [baseProps, isFormDisabled, isOpen, isProcessing]
  );
};
