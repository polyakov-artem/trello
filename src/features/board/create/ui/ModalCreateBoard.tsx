import { type FC } from 'react';
import Modal from '@/shared/ui/Modal/Modal';
import Input from 'antd/es/input/Input';
import { Button } from 'antd';
import { ScreenLoader } from '@/shared/ui/ScreenLoader/ScreenLoader';
import { ErrorWithReloadBtn } from '@/shared/ui/ErrorWithReload/ErrorWithReloadBtn';
import { useModalCreateBoard } from '../model/useModalCreateBoard';

export type ModalCreateBoardProps = {
  closeModal: () => void;
  isOpen: boolean;
};

export const TITLE = 'Create board';

export const ModalCreateBoard: FC<ModalCreateBoardProps> = ({ closeModal, isOpen }) => {
  const {
    formRef,
    isCreatingBoard,
    session,
    formValues,
    formError,
    isCreateBtnDisabled,
    isCancelBtnDisabled,
    isLoadingDeps,
    depsError,
    handleInputChange,
    handleCloseModal,
    handleSubmit,
    handleCreateBtnClick,
  } = useModalCreateBoard({ closeModal });

  if (!session) return null;

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
          loading={isCreatingBoard}
          onClick={handleCreateBtnClick}
          disabled={isCreateBtnDisabled}>
          Create board
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
    />
  );
};
