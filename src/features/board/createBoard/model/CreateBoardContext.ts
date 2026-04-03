import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { ModalProps } from '@/shared/ui/Modal/useModalProps';

export const CreateBoardContext = createStrictContext<ModalProps>();

export const useCreateBoardContext = () => {
  return useStrictContext(CreateBoardContext);
};
