import { useSessionStore } from '@/entities/session';
import { ScreenLoader } from '@/shared/ui/ScreenLoader/ScreenLoader';
import { ErrorWithReloadBtn } from '@/shared/ui/ErrorWithReload/ErrorWithReloadBtn';
import { type FC } from 'react';
import { BtnCreateTask } from '@/features/task/create';
import { BtnUpdateTask } from '@/features/task/update';
import { TasksTable } from '@/widgets/TasksTable';
import { WindowUpdateTask } from '@/widgets/WindowUpdateTask';
import { BtnDeleteTask } from '@/features/task/delete';

const MSG_NO_PERMISSION = "Please log in. You don't have permission to create tasks";
const TITLE = 'Tasks';

const Container: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="container mx-auto p-4 grow flex flex-col">{children}</div>
);

const Content: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className=" self-center w-full flex flex-col gap-6">{children}</div>
);

const Title: FC = () => <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>;

export const TasksPage: FC = () => {
  const sessionError = useSessionStore.use.error();
  const sessionIsLoading = useSessionStore.use.isLoading();
  const session = useSessionStore.use.value();

  if (sessionError) {
    return (
      <Container>
        <ErrorWithReloadBtn title={sessionError.message} />
      </Container>
    );
  }

  if (sessionIsLoading) {
    return (
      <Container>
        <ScreenLoader />
      </Container>
    );
  }

  if (!session) {
    return (
      <Container>
        <Content>
          <Title />
          <p className="font-bold text-center">{MSG_NO_PERMISSION}</p>
        </Content>
      </Container>
    );
  }

  return (
    <WindowUpdateTask>
      <Container>
        <Content>
          <Title />
          <BtnCreateTask className={'ml-auto'} />
          <TasksTable
            renderActions={(taskId) => (
              <div className="inline-flex flex-wrap gap-2 items-center">
                <BtnDeleteTask taskId={taskId} />
                <BtnUpdateTask taskId={taskId} />
              </div>
            )}
          />
        </Content>
      </Container>
    </WindowUpdateTask>
  );
};
