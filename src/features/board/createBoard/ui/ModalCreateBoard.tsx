import { type FC } from 'react';
import Modal from '@/shared/ui/Modal/Modal';
import Input from 'antd/es/input/Input';
import { Button } from 'antd';
import { useModalCreateBoard } from '../model/useModalCreateBoard';

export const TITLE = 'Create board';

export const ModalCreateBoard: FC = () => {
  const {
    values,
    titleError,
    formError,
    handleInputChange,
    handleSubmit,
    handleSubmitBtnClick,
    closeModal,
    isFormDisabled,
    isOpen,
    isProcessing,
  } = useModalCreateBoard();

  const body = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError && <p className="text-red-500">{formError}</p>}
      <div>
        <label className="font-bold mb-2 block" htmlFor="title">
          {TITLE}
        </label>

        <Input
          id="title"
          name="title"
          onChange={handleInputChange}
          value={values.title}
          disabled={isFormDisabled}
        />
        {titleError && <p className="text-red-500">{titleError}</p>}
      </div>
    </form>
  );

  const buttons = (
    <>
      <Button
        loading={isProcessing}
        disabled={isFormDisabled}
        type="primary"
        onClick={handleSubmitBtnClick}>
        Create
      </Button>
      <Button type="primary" onClick={closeModal}>
        Cancel
      </Button>
    </>
  );

  return (
    <Modal closeModal={closeModal} isOpen={isOpen} title={TITLE} body={body} buttons={buttons} />
  );
};
