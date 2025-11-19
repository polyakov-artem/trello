import { createStrictContext, useStrictContext } from '@/shared/lib/react';

export type ShowModalParams = {
  taskId: string;
};

export type UpdateModalContextValue = {
  showModal: (params: ShowModalParams) => void;
};

export const UpdateModalTaskContext = createStrictContext<UpdateModalContextValue>();

export const useModalUpdateTaskContext = () => {
  return useStrictContext(UpdateModalTaskContext);
};
