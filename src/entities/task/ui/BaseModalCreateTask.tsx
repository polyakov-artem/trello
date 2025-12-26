import { type FC } from 'react';
import Modal from '@/shared/ui/Modal/Modal';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { Button, Checkbox, type CheckboxChangeEvent } from 'antd';

export const TITLE = 'Create task';

export type ModalCreateTaskProps = {
  isProcessing: boolean;
  isFormDisabled: boolean;
  titleError: string;
  formError: string;
  values: {
    title: string;
    description: string;
    completed: boolean;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleCheckboxChange: (e: CheckboxChangeEvent) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  handleSubmitBtnClick: () => void;
  closeModal: () => void;
  isOpen: boolean;
};

export const BaseModalCreateTask: FC<ModalCreateTaskProps> = (props) => {
  const {
    values,
    titleError,
    formError,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleSubmitBtnClick,
    closeModal,
    isFormDisabled,
    isProcessing,
    isOpen,
  } = props;

  const body = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError && <p className="text-red-500">{formError}</p>}
      <div>
        <label className="font-bold mb-2 block" htmlFor="title">
          Title
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

      <div>
        <label className="font-bold mb-2 block" htmlFor="description">
          Description
        </label>

        <TextArea
          id="description"
          name="description"
          onChange={handleInputChange}
          value={values.description}
          disabled={isFormDisabled}
        />
      </div>

      <Checkbox
        onChange={handleCheckboxChange}
        name="completed"
        checked={values.completed}
        disabled={isFormDisabled}>
        Completed
      </Checkbox>
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
