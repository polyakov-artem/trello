import { createStrictContext, useStrictContext } from '@/shared/lib/reactStrictContext';

export type LogoutContextValue = {
  logout: ({ initiatedByUser }: { initiatedByUser: boolean }) => Promise<void>;
  isLoggingOut: boolean;
};

export const LogoutContext = createStrictContext<LogoutContextValue>();

export const useLogoutContext = () => {
  return useStrictContext(LogoutContext);
};
