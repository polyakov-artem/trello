import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { useModalProps } from '@/shared/ui/Modal/useModalProps';

export const CreateTaskContext = createStrictContext<ReturnType<typeof useModalProps>>();

export const useCreateTaskContext = () => {
  return useStrictContext(CreateTaskContext);
};
