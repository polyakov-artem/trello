import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';

export type UsersListErrorProps = {
  msg?: string;
} & PropsWithClassName;

export const UsersListError: FC<UsersListErrorProps> = ({ msg, className }) => {
  const classes = useMemo(() => clsx('text-red-500 text-center', className), [className]);

  return <p className={classes}>{msg}</p>;
};
