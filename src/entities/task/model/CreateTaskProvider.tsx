import { CreateTaskContext, type Details } from './CreateTaskContext';
import { useModalProps } from '@/shared/ui/Modal/useModalProps';

export const CreateTaskProvider = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useModalProps<Details>();

  return <CreateTaskContext value={contextValue}>{children}</CreateTaskContext>;
};
