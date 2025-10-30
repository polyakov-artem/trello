import { useCallback } from 'react';
import type { Session } from '@/entities/session';
import type { ErrorInfo } from '@/shared/lib/getResponseData';

export type SwitchUserProps = {
  id: string;
  logout: () => Promise<void | { data: boolean }>;
  loginWithUserId: (userId: string) => Promise<
    | {
        data: Session;
        error?: undefined;
      }
    | {
        error: ErrorInfo;
        data?: undefined;
      }
    | undefined
  >;
};

export const useSwitchUser = () => {
  const switchUser = useCallback(async ({ id, logout, loginWithUserId }: SwitchUserProps) => {
    await logout();

    const result = await loginWithUserId(id);
    return result;
  }, []);

  return {
    switchUser,
  };
};
