import { type FC } from 'react';
import { useBoardsStore } from '@/entities/board';
import {
  BtnCreateBoard,
  CreateBoardProvider,
  ModalCreateBoard,
} from '@/features/board/createBoard';
import { EditBoardProvider, ModalEditBoard } from '@/features/board/editBoard';
import { BoardsTable } from '@/widgets/BoardsTable';
import { AuthProtected } from '@/widgets/AuthProtected';

const TITLE = 'Boards';

export const BoardsPage: FC = () => {
  const boards = useBoardsStore.use.value();
  const isLoadingBoards = useBoardsStore.use.isLoading();
  const boardsError = useBoardsStore.use.error();

  return (
    <CreateBoardProvider>
      <EditBoardProvider>
        <div className="container mx-auto p-4 grow flex">
          <div className="flex flex-col gap-6 grow">
            <h1 className="font-bold text-3xl text-center ">{TITLE}</h1>
            <AuthProtected className="grow">
              <BtnCreateBoard className={'ml-auto'} />

              <BoardsTable
                boards={boards}
                isLoading={isLoadingBoards}
                errorMsg={boardsError?.message}
              />
            </AuthProtected>
          </div>
        </div>

        <ModalEditBoard />
        <ModalCreateBoard />
      </EditBoardProvider>
    </CreateBoardProvider>
  );
};
