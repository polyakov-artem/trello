import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { ModalProps } from '@/shared/ui/Modal/useModalProps';

export const AddBoardColumnContext = createStrictContext<ModalProps>();

export const useAddBoardColumnContext = () => {
  return useStrictContext(AddBoardColumnContext);
};
