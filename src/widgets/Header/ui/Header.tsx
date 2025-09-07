import { ROUTER_PATHS } from '@/shared/constants/routes';
import type { PropsWithClassName } from '@/shared/types/types';
import { Logo } from '@/shared/ui/Logo/Logo';
import { NavLinks } from '@/shared/ui/NavLinks/NavLinks';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

export type HeaderProps = PropsWithClassName & {
  profileButton?: ReactNode;
};

const LINKS = [
  [ROUTER_PATHS.BOARDS, 'Boards'],
  [ROUTER_PATHS.USERS, 'Users'],
] satisfies Array<[string, string]>;

export const Header: FC<HeaderProps> = ({ className, profileButton }) => {
  return (
    <header
      className={clsx(
        'px-4 py-5 border-b border-b-slate-300 flex justify-between items-center bg-white ',
        'grid grid-cols-[1fr_auto_1fr] gap-2',
        className
      )}>
      <Logo />
      <NavLinks links={LINKS} />
      {profileButton}
    </header>
  );
};
