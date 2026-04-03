import { UserPreview } from '@/entities/user';
import type { PropsWithClassName } from '@/shared/types/types';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import clsx from 'clsx';
import { useCallback, useMemo, type FC } from 'react';
import { UserListSkeleton } from './UserListSkeleton';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';
import { useSessionUserId } from '@/entities/session';
import { BtnLogin } from '@/features/auth/login';
import { BtnLogout } from '@/features/auth/logout';
import { BtnRemoveUser } from '@/features/user/removeUser';
import { useUsersQuery } from '@/entities/user/';

export type UsersListProps = PropsWithClassName;

export const EMPTY_USERS_LIST = 'The list of users is empty';

export const UsersList: FC<UsersListProps> = ({ className }) => {
  const sessionUserId = useSessionUserId();
  const { users, isPendingUsers, isFetchingUsers, usersError } = useUsersQuery();
  const classes = useMemo(() => clsx(className, 'flex flex-col gap-2 relative'), [className]);
  const listClasses = 'flex flex-col gap-2 ';
  const itemClasses = 'flex items-center justify-between py-2';
  const btnsWrapClasses = 'flex gap-2.5 items-center';

  const renderActions = useCallback(
    (userId: string) => (
      <>
        {sessionUserId === userId ? (
          <>
            <BtnRemoveUser id={userId} />
            <BtnLogout>Log out</BtnLogout>
          </>
        ) : (
          <>
            <BtnLogin userId={userId}>Log in</BtnLogin>
          </>
        )}
      </>
    ),
    [sessionUserId]
  );

  return (
    <div className={classes}>
      {isPendingUsers ? (
        <UserListSkeleton
          className={listClasses}
          itemClasses={itemClasses}
          btnsWrapClasses={btnsWrapClasses}
        />
      ) : usersError ? (
        <ErrorBanner title={usersError.message} withBorder />
      ) : users?.length ? (
        <ul className={listClasses}>
          {isFetchingUsers && <Spinner onTopMode withOverlay whiteOverlay />}
          {users?.map(({ id, name, avatarId }) => {
            return (
              <li key={id} className={itemClasses}>
                <UserPreview name={name} avatarId={avatarId} />
                <div className={btnsWrapClasses}>{renderActions(id)}</div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center">{EMPTY_USERS_LIST}</p>
      )}
    </div>
  );
};
