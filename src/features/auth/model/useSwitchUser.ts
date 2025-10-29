import { useCallback } from 'react';
import type { Session } from '@/entities/session';

export type SwitchUserProps = {
  id: string;
  logout: (throwError?: boolean) => Promise<void | { data: boolean }>;
  loginWithUserId: (
    userId: string,
    throwError?: boolean
  ) => Promise<
    | {
        data: Session;
        error?: undefined;
      }
    | {
        error: string;
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
