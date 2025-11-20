import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type ShowModalParams = {
  boardId: string;
};

export type UpdateModalContextValue = {
  showModal: (params: ShowModalParams) => void;
};

export const UpdateBoardContext = createStrictContext<UpdateModalContextValue>();

export const useUpdateBoardContext = () => {
  return useStrictContext(UpdateBoardContext);
};
