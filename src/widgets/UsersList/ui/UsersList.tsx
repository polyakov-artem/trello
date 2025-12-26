import { UserPreview } from '@/entities/user';
import type { User } from '@/shared/api/user/userApi';
import type { PropsWithClassName } from '@/shared/types/types';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';
import { UserListSkeleton } from './UserListSkeleton';
import { UsersListError } from './UsersListError';

export type UsersListProps = {
  users?: User[] | undefined;
  isLoading?: boolean;
  errorMsg?: string;
  renderActions?: (userId: string) => React.ReactNode;
} & PropsWithClassName;

export const EMPTY_USERS_LIST = 'The list of users is empty';

export const UsersList: FC<UsersListProps> = ({
  users,
  isLoading,
  errorMsg,
  renderActions,
  className,
}) => {
  const classes = useMemo(() => clsx(className, 'flex flex-col gap-2 relative'), [className]);
  const listClasses = 'flex flex-col gap-2';
  const itemClasses = 'flex items-center justify-between py-2';
  const btnsWrapClasses = 'flex gap-2.5 items-center';

  const content =
    !users && isLoading ? (
      <UserListSkeleton
        className={listClasses}
        itemClasses={itemClasses}
        btnsWrapClasses={btnsWrapClasses}
      />
    ) : (
      <>
        {isLoading && <Spinner onTopMode withOverlay whiteOverlay />}

        {!!errorMsg && <UsersListError msg={errorMsg} />}

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
