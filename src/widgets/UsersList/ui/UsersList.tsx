import { UserPreview, useUsersStore } from '@/entities/user';
import type { PropsWithClassName } from '@/shared/types/types';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import clsx from 'clsx';
import { useCallback, useMemo, type FC } from 'react';
import { UserListSkeleton } from './UserListSkeleton';
import { UsersListError } from './UsersListError';
import { useSessionStore } from '@/entities/session';
import { BtnRemoveUser } from '@/features/user/removeUser';
import { BtnLogin } from '@/features/auth/login';
import { BtnLogout } from '@/features/auth/logout';

export type UsersListProps = PropsWithClassName;

export const EMPTY_USERS_LIST = 'The list of users is empty';

export const UsersList: FC<UsersListProps> = ({ className }) => {
  const classes = useMemo(() => clsx(className, 'flex flex-col gap-2 relative'), [className]);
  const listClasses = 'flex flex-col gap-2';
  const itemClasses = 'flex items-center justify-between py-2';
  const btnsWrapClasses = 'flex gap-2.5 items-center';

  const users = useUsersStore.use.value();
  const isLoadingUsers = useUsersStore.use.isLoading();
  const usersError = useUsersStore.use.error();
  const sessionUserId = useSessionStore.use.value()?.userId;

  const renderActions = useCallback(
    (userId: string) => (
      <>
        {userId === sessionUserId ? (
          <>
            <BtnRemoveUser id={userId} />
            <BtnLogout />
          </>
        ) : (
          <BtnLogin userId={userId} />
        )}
      </>
    ),
    [sessionUserId]
  );

  const content =
    !users && isLoadingUsers ? (
      <UserListSkeleton
        className={listClasses}
        itemClasses={itemClasses}
        btnsWrapClasses={btnsWrapClasses}
      />
    ) : (
      <>
        {isLoadingUsers && <Spinner onTopMode withOverlay whiteOverlay />}

        {!!usersError && <UsersListError msg={usersError.message} />}

        {users?.length ? (
          <ul className={listClasses}>
            {users?.map(({ id, name, avatarId }) => {
              return (
                <li key={id} className={itemClasses}>
                  <UserPreview name={name} avatarId={avatarId} />
                  <div className={btnsWrapClasses}>{renderActions?.(id)}</div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center">{EMPTY_USERS_LIST}</p>
        )}
      </>
    );

  return <div className={classes}>{content}</div>;
};
