import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type LogOut = () => Promise<
  | {
      success: boolean;
    }
  | undefined
>;

export const RemoveUserDepsContext = createStrictContext<LogOut>();
export const useRemoveUserDepsContext = () => useStrictContext(RemoveUserDepsContext);
