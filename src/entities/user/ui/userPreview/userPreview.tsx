import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import type { FC } from 'react';
import { getAvatarURL } from '../../index';

export type UserPreviewProps = PropsWithClassName & {
  name?: string;
  avatarId?: string | number;
  isLoading?: boolean;
};

export const UserPreview: FC<UserPreviewProps> = ({
  className,
  name = '',
  avatarId = '',
  isLoading,
}) => {
  const classes = clsx(className, 'flex items-center gap-2', { 'animate-pulse': isLoading });

  if (isLoading) {
    return (
      <div className={classes}>
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div className="w-30 h-6 rounded-sm bg-gray-200"></div>
      </div>
    );
  }

  if (!name && !avatarId) {
    return null;
  }

  return (
    <div className={classes}>
      <img className="w-10 h-10" src={getAvatarURL(avatarId)} alt="" />
      <p>{name}</p>
    </div>
  );
};
