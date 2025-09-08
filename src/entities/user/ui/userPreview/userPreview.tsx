import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import type { FC } from 'react';

export type UserPreviewProps = PropsWithClassName & {
  name?: string;
  avatarId: string | number;
};

function getAvatarUrl(avatarId: string | number) {
  const id = Math.min(8, Math.max(1, parseInt(String(avatarId), 10)));

  return new URL(`./assets/avatars/${id}.png`, import.meta.url).href;
}

export const UserPreview: FC<UserPreviewProps> = ({ className, name, avatarId }) => {
  return (
    <div className={clsx(className, 'flex items-center gap-2')}>
      <img className="w-10 h-10" src={getAvatarUrl(avatarId)} alt="" />
      {!!name && <p>{name}</p>}
    </div>
  );
};
