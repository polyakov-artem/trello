import type { PropsWithClassName } from '@/shared/types/types';
import type { FC } from 'react';
import { NavLink } from 'react-router';

export type NavLinksProps = PropsWithClassName & {
  links: Array<[string, string]>;
};

export const NavLinks: FC<NavLinksProps> = ({ links }) => {
  return (
    <ul className="flex gap-3">
      {links.map(([link, text]) => (
        <li key={link}>
          <NavLink
            to={link}
            relative="path"
            className={({ isActive }) => (isActive ? 'underline font-bold' : '')}>
            {text}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
