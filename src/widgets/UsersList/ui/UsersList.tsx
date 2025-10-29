import { UserPreview, useUsersStore } from '@/entities/user';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

export type UsersListProps = PropsWithClassName & {
  renderActions: (id: string) => ReactNode;
};

export const UsersList: FC<UsersListProps> = ({ className, renderActions }) => {
  const users = useUsersStore.use.users();
  const usersState = useUsersStore.use.usersState();
  const isLoading = usersState.isLoading;

  const listClasses = clsx(className, 'flex flex-col gap-2');
  const itemClasses = clsx('flex items-center justify-between py-2');
  const btnsWrapClasses = clsx('flex gap-2.5 items-center', { 'animate-pulse': isLoading });

  if (isLoading) {
    return (
      <ul className={listClasses}>
        <li className={itemClasses}>
          <UserPreview isLoading />
          <div className={btnsWrapClasses}>
            <div className="w-15 h-8 rounded-sm bg-gray-200" />
            <div className="w-15 h-8 rounded-sm bg-gray-200" />
          </div>
        </li>
      </ul>
    );
  }

  if (!users.length) {
    return null;
  }

  return (
    <ul className={listClasses}>
      {users.map(({ id, name, avatarId }) => (
        <li key={id} className={itemClasses}>
          <UserPreview name={name} avatarId={avatarId} isLoading={isLoading} />
          <div className={btnsWrapClasses}>{renderActions(id)}</div>
        </li>
      ))}
    </ul>
  );
};
