export type PropsWithClassName = {
  className?: string;
};

export type PropsWithChildrenAndClassName = PropsWithClassName & {
  children?: React.ReactNode;
};

export type Task = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  completed: boolean;
};

export type TaskDraft = Partial<Omit<Task, 'id' | 'authorId'>>;
