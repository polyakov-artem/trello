import { useSessionStore } from '@/entities/session';
import { ScreenLoader } from '@/shared/ui/ScreenLoader/ScreenLoader';
import { ErrorWithReloadBtn } from '@/shared/ui/ErrorWithReload/ErrorWithReloadBtn';
import { type FC } from 'react';
import { BtnCreateBoard } from '@/features/board/create';
import { BtnUpdateBoard } from '@/features/board/update';
import { BoardsTable } from '@/widgets/BoardsTable';
import { WindowUpdateBoard } from '@/widgets/WindowUpdateBoard';
import { BtnDeleteBoard } from '@/features/board/delete';

const MSG_NO_PERMISSION = "Please log in. You don't have permission to create boards";
const TITLE = 'Boards';

const Container: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="container mx-auto p-4 grow flex flex-col">{children}</div>
);

const Content: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className=" self-center w-full flex flex-col gap-6">{children}</div>
);

const Title: FC = () => <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>;

export const BoardsPage: FC = () => {
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
    <WindowUpdateBoard>
      <Container>
        <Content>
          <Title />
          <BtnCreateBoard className={'ml-auto'} />
          <BoardsTable
            renderActions={(boardId) => (
              <div className="inline-flex flex-wrap gap-2 items-center">
                <BtnDeleteBoard boardId={boardId} />
                <BtnUpdateBoard boardId={boardId} />
              </div>
            )}
          />
        </Content>
      </Container>
    </WindowUpdateBoard>
  );
};
