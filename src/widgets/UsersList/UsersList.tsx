import { UserPreview, useUsersStore } from '@/entities/user';
import { BtnRemoveUser } from '@/features/manageUser';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import type { FC } from 'react';

export const UsersList: FC<PropsWithClassName> = ({ className }) => {
  const users = useUsersStore.use.users();

  return (
    <ul className={clsx(className, 'flex flex-col gap-2')}>
      {users.map(({ id, name, avatarId }) => (
        <li key={id} className="flex items-center justify-between py-2">
          <UserPreview name={name} avatarId={avatarId} />
          <BtnRemoveUser id={id} />
        </li>
      ))}
    </ul>
  );
};
