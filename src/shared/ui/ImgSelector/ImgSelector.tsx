import type { FC } from 'react';
import type { PropsWithClassName } from '@/shared/types/types';
import clsx from 'clsx';

export type ImgSelectorProps = {
  images: { src: string; id: number | string; alt?: string }[];
  name?: string;
  checkedValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
} & PropsWithClassName;

export const ImgSelector: FC<ImgSelectorProps> = ({
  name,
  onChange,
  className,
  checkedValue,
  error,
  images,
}) => {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4">
        {images.map(({ src, id, alt }, i) => {
          const value = id !== undefined ? id : i;
          const avatarClasses = clsx('w-10 h-10 rounded-full', {
            'ring-2 ring-offset-2 ring-blue-400': value === checkedValue,
          });

          return (
            <label
              key={value}
              className={clsx({
                'cursor-default': value === checkedValue,
                'cursor-pointer': value !== checkedValue,
              })}>
              <input
                type="radio"
                name={name}
                value={value}
                className="hidden"
                onChange={onChange}
                checked={value === checkedValue}
              />
              <img className={avatarClasses} src={src} alt={alt || ''} />
            </label>
          );
        })}
      </div>

      <p className="text-red-500 text-sm leading-[1] ">{error}&nbsp;</p>
    </div>
  );
};
