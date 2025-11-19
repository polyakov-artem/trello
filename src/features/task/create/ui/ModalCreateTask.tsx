import { type FC } from 'react';
import Modal from '../../../../shared/ui/Modal/Modal';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { Button, Checkbox } from 'antd';
import { ScreenLoader } from '@/shared/ui/ScreenLoader/ScreenLoader';
import { ErrorWithReloadBtn } from '../../../../shared/ui/ErrorWithReload/ErrorWithReloadBtn';
import { useModalCreateTask } from '@/features/task/create';

export type ModalCreateTaskProps = {
  closeModal: () => void;
  isOpen: boolean;
};

export const TITLE = 'Create task';

export const ModalCreateTask: FC<ModalCreateTaskProps> = ({ closeModal, isOpen }) => {
  const {
    formRef,
    isCreatingTask,
    session,
    formValues,
    formError,
    isCreateBtnDisabled,
    isCancelBtnDisabled,
    isLoadingDeps,
    depsError,
    handleCheckboxChange,
    handleInputChange,
    handleCloseModal,
    handleSubmit,
    handleCreateBtnClick,
  } = useModalCreateTask({ closeModal });

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

      <div>
        <label className="font-bold mb-2 block" htmlFor="description">
          Description
        </label>

        <TextArea
          id="description"
          name="description"
          onChange={handleInputChange}
          value={formValues.description}
        />
      </div>

      <Checkbox onChange={handleCheckboxChange} name="completed" checked={formValues.completed}>
        Completed
      </Checkbox>
    </form>
  );

  const buttons =
    isLoadingDeps || depsError ? null : (
      <>
        <Button
          type="primary"
          loading={isCreatingTask}
          onClick={handleCreateBtnClick}
          disabled={isCreateBtnDisabled}>
          Create task
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
