import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

type DelayerContextValue = (
  resolveBtnTitle?: string,
  rejectBtnTitle?: string
) => {
  promise: Promise<void>;
  resolve: () => void;
  reject: (e: Error) => void;
};

export const DelayerContext = createStrictContext<DelayerContextValue>();
export const useCreateDelayer = () => useStrictContext<DelayerContextValue>(DelayerContext);
