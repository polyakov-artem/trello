import { useSessionStore } from '@/entities/session';
import { UserPreview } from '@/entities/user';
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

export const Header: FC<HeaderProps> = ({ className }) => {
  const sessionUser = useSessionStore.use.sessionUser();
  const sessionUserState = useSessionStore.use.sessionUserState();
  const sessionState = useSessionStore.use.sessionState();
  const isLoading = sessionUserState.isLoading || sessionState.isLoading;

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
