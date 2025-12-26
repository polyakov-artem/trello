import { UserPreview } from '@/entities/user';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import { useMemo, type FC } from 'react';

export type UserListSkeletonProps = {
  itemClasses: string;
  btnsWrapClasses: string;
  numberOfUsers?: number;
} & PropsWithClassName;

export const UserListSkeleton: FC<UserListSkeletonProps> = (props) => {
  const { className, itemClasses, btnsWrapClasses, numberOfUsers = 5 } = props;

  const btnsContainerClasses = useMemo(
    () => clsx(btnsWrapClasses, 'animate-pulse'),
    [btnsWrapClasses]
  );

  return (
    <ul className={className}>
      {Array.from({ length: numberOfUsers }, (_, i) => (
        <li className={itemClasses} key={i}>
          <UserPreview isLoading />
          <div className={btnsContainerClasses}>
            <div className="w-15 h-8 rounded-sm bg-gray-200" />
            <div className="w-15 h-8 rounded-sm bg-gray-200" />
          </div>
        </li>
      ))}
    </ul>
  );
};
