import { type FC } from 'react';
import Modal from '@/shared/ui/Modal/Modal';
import Input from 'antd/es/input/Input';
import { Button } from 'antd';
import { useModalAddBoardColumn } from '../model/useModalAddBoardColumn';

export const MODAL_TITLE = 'Add board column';
export const TITLE_LABEL = 'Title';

export const ModalAddBoardColumn: FC = () => {
  const {
    isProcessing,
    closeModal,
    isOpen,
    isFormDisabled,
    onCloseComplete,
    formError,
    titleError,
    values,
    handleInputChange,
    handleSubmit,
    handleSubmitBtnClick,
  } = useModalAddBoardColumn();

  const body = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
      {formError && <p className="text-red-500">{formError}</p>}
      <div>
        <label className="font-bold mb-2 block" htmlFor="title">
          {TITLE_LABEL}
        </label>

        <Input id="title" name="title" onChange={handleInputChange} value={values.title} />
        {titleError && <p className="text-red-500">{titleError}</p>}
      </div>
    </form>
  );

  const buttons = (
    <>
      <Button
        type="primary"
        loading={isProcessing}
        onClick={handleSubmitBtnClick}
        disabled={isFormDisabled}>
        Add column
      </Button>
      <Button type="primary" onClick={closeModal}>
        Cancel
      </Button>
    </>
  );

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={MODAL_TITLE}
      body={body}
      buttons={buttons}
      onCloseComplete={onCloseComplete}
    />
  );
};
