import { useBoardsQuery } from '@/entities/board';
import { useAutoLoginQuery } from '@/features/auth/autoLogin';
import { useTasksQuery } from '@/entities/task/';
import { useSessionUserQuery } from '@/entities/user/';
import { useUsersQuery } from '@/entities/user/';
import { type FC, type PropsWithChildren } from 'react';

export const AppLoader: FC<PropsWithChildren> = ({ children }) => {
  useAutoLoginQuery();
  useTasksQuery();
  useSessionUserQuery();
  useUsersQuery();
  useBoardsQuery();

  return children;
};
