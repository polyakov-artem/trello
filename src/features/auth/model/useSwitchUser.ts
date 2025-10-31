import { useCallback } from 'react';
import type { Session } from '@/entities/session';
import type { FetchResult } from '@/shared/lib/safeFetch';

export type SwitchUserProps = {
  userId: string;
  logout: () => Promise<
    | {
        success: boolean;
      }
    | undefined
  >;
  loginWithUserId: (userId: string) => Promise<FetchResult<Session> | undefined>;
};

export const useSwitchUser = () => {
  const switchUser = useCallback(async ({ userId, logout, loginWithUserId }: SwitchUserProps) => {
    await logout();

    const result = await loginWithUserId(userId);
    return result;
  }, []);

  return {
    switchUser,
  };
};
