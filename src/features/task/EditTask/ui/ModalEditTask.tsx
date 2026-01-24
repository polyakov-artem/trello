import { type FC } from 'react';
import Modal from '@/shared/ui/Modal/Modal';

import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { Button, Checkbox } from 'antd';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { useModalEditTask } from '../model/useModalEditTask';

export const TITLE = 'Update task';

export const ModalEditTask: FC = () => {
  const {
    processing,
    isLoading,
    closeModal,
    isOpen,
    isFormDisabled,
    onCloseComplete,
    formError,
    titleError,
    values,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleSubmitBtnClick,
  } = useModalEditTask();

  const body = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
      {formError && <p className="text-red-500">{formError}</p>}
      <div>
        <label className="font-bold mb-2 block" htmlFor="title">
          {TITLE}
        </label>

        <Input id="title" name="title" onChange={handleInputChange} value={values.title} />
        {titleError && <p className="text-red-500">{titleError}</p>}
      </div>

      <div>
        <label className="font-bold mb-2 block" htmlFor="description">
          Description
        </label>

        <TextArea
          id="description"
          name="description"
          onChange={handleInputChange}
          value={values.description}
        />
      </div>

      <Checkbox onChange={handleCheckboxChange} name="completed" checked={values.completed}>
        Completed
      </Checkbox>
      {isLoading && <Spinner withOverlay whiteOverlay onTopMode />}
    </form>
  );

  const buttons = (
    <>
      <Button
        type="primary"
        loading={processing}
        onClick={handleSubmitBtnClick}
        disabled={isFormDisabled}>
        Update
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
      title={TITLE}
      body={body}
      buttons={buttons}
      onCloseComplete={onCloseComplete}
    />
  );
};
