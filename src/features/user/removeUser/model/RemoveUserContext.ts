import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type RemoveUserContextValue = {
  logout: () => Promise<
    | {
        success: boolean;
      }
    | undefined
  >;
};

export const RemoveUserContext = createStrictContext<RemoveUserContextValue>();
export const useRemoveUserContext = () => useStrictContext(RemoveUserContext);
