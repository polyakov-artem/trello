import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import type { FC } from 'react';
import { getAvatarURL } from '../../index';

export type UserPreviewProps = PropsWithClassName & {
  name?: string;
  avatarId: string | number;
};

export const UserPreview: FC<UserPreviewProps> = ({ className, name, avatarId }) => {
  return (
    <div className={clsx(className, 'flex items-center gap-2')}>
      <img className="w-10 h-10" src={getAvatarURL(avatarId)} alt="" />
      {!!name && <p>{name}</p>}
    </div>
  );
};
