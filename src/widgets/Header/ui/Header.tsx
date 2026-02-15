import { useSessionStore } from '@/entities/session';
import { UserPreview, useSessionUserStore } from '@/entities/user';
import { ROUTER_PATHS } from '@/shared/config/routes';
import type { PropsWithClassName } from '@/shared/types/types';
import { Logo } from '@/shared/ui/Logo/Logo';
import { NavLinks } from '@/shared/ui/NavLinks/NavLinks';
import clsx from 'clsx';
import type { FC } from 'react';

export type HeaderProps = PropsWithClassName;

const LINKS = [
  [ROUTER_PATHS.USERS, 'Users'],
  [ROUTER_PATHS.TASKS, 'Tasks'],
  [ROUTER_PATHS.BOARDS, 'Boards'],
] satisfies Array<[string, string]>;

export const Header: FC<HeaderProps> = ({ className }) => {
  const sessionUser = useSessionUserStore.use.value();
  const isLoadingSessionUser = useSessionUserStore.use.isLoading();
  const isLoadingSession = useSessionStore.use.isLoading();

  const isLoading = isLoadingSessionUser || isLoadingSession;

  return (
    <header className={clsx('border-b border-b-slate-300  bg-white', className)}>
      <div className="flex items-center container mx-auto px-4 py-5 gap-4">
        <Logo />
        <NavLinks links={LINKS} className="mx-auto" />

        <UserPreview
          name={sessionUser?.name}
          avatarId={sessionUser?.avatarId}
          isLoading={isLoading}
        />
      </div>
    </header>
  );
};
