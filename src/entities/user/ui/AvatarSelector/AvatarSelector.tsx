import type { FC } from 'react';
import { getAvatarURL } from '../getAvatarURL';
import { ImgSelector, type ImgSelectorProps } from '@/shared/ui/ImgSelector/ImgSelector';

const NUM_OF_AVATARS = 8;

const images = [...Array(NUM_OF_AVATARS).keys()].map((i) => ({
  src: getAvatarURL(`${i + 1}`),
  id: `${i + 1}`,
}));

export type AvatarSelectorProps = Omit<ImgSelectorProps, 'images'>;

export const AvatarSelector: FC<AvatarSelectorProps> = ({
  name,
  onChange,
  className,
  checkedValue,
  error,
}) => {
  return (
    <ImgSelector
      name={name}
      onChange={onChange}
      className={className}
      checkedValue={checkedValue}
      error={error}
      images={images}
    />
  );
};
