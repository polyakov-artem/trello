import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { useModalProps } from '@/shared/ui/Modal/useModalProps';

export const CreateBoardContext = createStrictContext<ReturnType<typeof useModalProps>>();

export const useCreateBoardContext = () => {
  return useStrictContext(CreateBoardContext);
};
