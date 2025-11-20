import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type ShowModalParams = {
  taskId: string;
};

export type UpdateModalContextValue = {
  showModal: (params: ShowModalParams) => void;
};

export const UpdateTaskContext = createStrictContext<UpdateModalContextValue>();

export const useUpdateTaskContext = () => {
  return useStrictContext(UpdateTaskContext);
};
