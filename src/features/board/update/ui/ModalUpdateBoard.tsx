import { type FC } from 'react';
import Modal from '@/shared/ui/Modal/Modal';
import { useModalUpdateBoard } from '../model/useModalUpdateBoard';
import Input from 'antd/es/input/Input';
import { Button } from 'antd';
import { ScreenLoader } from '@/shared/ui/ScreenLoader/ScreenLoader';
import { ErrorWithReloadBtn } from '@/shared/ui/ErrorWithReload/ErrorWithReloadBtn';

export type ModalUpdateBoardProps = {
  closeModal: () => void;
  isOpen: boolean;
  boardId: string;
  onCloseComplete?: () => void;
};

export const TITLE = 'Update board';

export const ModalUpdateBoard: FC<ModalUpdateBoardProps> = (props: ModalUpdateBoardProps) => {
  const {
    formRef,
    isUpdatingBoard,
    session,
    formValues,
    formError,
    isUpdateBtnDisabled,
    isCancelBtnDisabled,
    isLoadingDeps,
    depsError,
    handleInputChange,
    handleCloseModal,
    handleSubmit,
    handleUpdateBtnClick,
  } = useModalUpdateBoard(props);
  const { boardId, isOpen, onCloseComplete } = props;

  if (!session || !boardId) return null;

  const body = isLoadingDeps ? (
    <ScreenLoader />
  ) : depsError ? (
    <ErrorWithReloadBtn showReloadBtn={false} title={depsError.message} />
  ) : (
    <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col gap-4">
      {formError && <p className="text-red-500">{formError}</p>}
      <div>
        <label className="font-bold mb-2 block" htmlFor="title">
          Title
        </label>

        <Input id="title" name="title" onChange={handleInputChange} value={formValues.title} />
      </div>
    </form>
  );

  const buttons =
    isLoadingDeps || depsError ? null : (
      <>
        <Button
          type="primary"
          loading={isUpdatingBoard}
          onClick={handleUpdateBtnClick}
          disabled={isUpdateBtnDisabled}>
          Update board
        </Button>
        <Button type="primary" onClick={handleCloseModal} disabled={isCancelBtnDisabled}>
          Cancel
        </Button>
      </>
    );

  return (
    <Modal
      closeModal={handleCloseModal}
      isOpen={isOpen}
      title={TITLE}
      body={body}
      buttons={buttons}
      onCloseComplete={onCloseComplete}
    />
  );
};
