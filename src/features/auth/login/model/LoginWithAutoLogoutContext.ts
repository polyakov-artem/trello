import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type LoginWithAutoLogoutContextValue = {
  logout: () => Promise<
    | {
        success: boolean;
      }
    | undefined
  >;
};

export const LoginWithAutoLogoutContext = createStrictContext<LoginWithAutoLogoutContextValue>();

export const useLoginWithAutoLogoutContext = () => {
  return useStrictContext(LoginWithAutoLogoutContext);
};
