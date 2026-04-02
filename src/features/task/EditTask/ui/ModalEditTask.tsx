import { type FC } from 'react';
import Modal from '@/shared/ui/Modal/Modal';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { Button, Checkbox } from 'antd';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { useModalEditTask } from '../model/useModalEditTask';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';

export const TITLE = 'Update task';

export const ModalEditTask: FC = () => {
  const {
    taskError,
    isFetchingTask,
    isUpdatingTask,
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
  } = useModalEditTask();

  const body = taskError ? (
    <ErrorBanner title={taskError.message} withDefaultIcon />
  ) : (
    <form onSubmit={handleSubmit}>
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
      {isFetchingTask && <Spinner withOverlay whiteOverlay onTopMode />}
    </form>
  );

  const buttons = taskError ? undefined : (
    <>
      <Button
        type="primary"
        loading={isUpdatingTask}
        disabled={isFormDisabled}
        onClick={() => handleSubmit()}>
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
