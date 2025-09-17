import { ROUTER_PATHS } from '@/shared/constants/routes';
import type { PropsWithClassName } from '@/shared/types/types';
import { Logo } from '@/shared/ui/Logo/Logo';
import { NavLinks } from '@/shared/ui/NavLinks/NavLinks';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

export type HeaderProps = PropsWithClassName & {
  userPreview?: ReactNode;
};

const LINKS = [
  [ROUTER_PATHS.BOARDS, 'Boards'],
  [ROUTER_PATHS.USERS, 'Users'],
] satisfies Array<[string, string]>;

export const Header: FC<HeaderProps> = ({ className, userPreview }) => {
  return (
    <header className={clsx('border-b border-b-slate-300  bg-white', className)}>
      <div className="flex items-center justify-between container mx-auto px-4 py-5 gap-4">
        <Logo />
        <NavLinks links={LINKS} />
        {userPreview}
      </div>
    </header>
  );
};
