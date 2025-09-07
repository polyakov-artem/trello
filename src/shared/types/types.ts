export type PropsWithClassName = {
  className?: string;
};

export type PropsWithChildrenAndClassName = PropsWithClassName & {
  children?: React.ReactNode;
};
