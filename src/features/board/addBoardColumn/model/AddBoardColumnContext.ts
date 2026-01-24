import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';
import type { useModalProps } from '@/shared/ui/Modal/useModalProps';

export const AddBoardColumnContext = createStrictContext<ReturnType<typeof useModalProps>>();

export const useAddBoardColumnContext = () => {
  return useStrictContext(AddBoardColumnContext);
};
