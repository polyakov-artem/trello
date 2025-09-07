import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';
import type { FC } from 'react';

export const Logo: FC<PropsWithClassName> = ({ className }) => {
  return (
    <div className={clsx(className, 'flex items-center gap-2 text-2xl ')}>
      <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-teal-500 from-40% to-blue-400">
        Easy Trello
      </span>
    </div>
  );
};
