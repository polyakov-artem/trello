import { useCallback, useMemo, useRef, useState, type FC } from 'react';
import Modal from '../../../shared/ui/Modal/Modal';
import { useTaskCreationStore } from '@/entities/task';
import { useCreateTask } from '@/features/manageTasks';
import { useSessionStore } from '@/entities/session';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import { Button, Checkbox, type CheckboxChangeEvent } from 'antd';
import type { NewTask } from '@/shared/api/task/taskApi';
import { UserSelect, useUsersStore } from '@/entities/user';

export type ModalCreateTaskProps = {
  closeModal: () => void;
  isOpen: boolean;
};

export const TITLE = 'Create task';

const defaultFormState: NewTask = {
  editorsIds: [] as string[],
  title: '',
  description: '',
  completed: false,
};

export const ModalCreateTask: FC<ModalCreateTaskProps> = ({ closeModal, isOpen }) => {
  const { createTask } = useCreateTask();
  const checkIfCreatingTask = useTaskCreationStore.use.checkIfLoading();
  const isLoading = useTaskCreationStore.use.isLoading();
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFromValues] = useState(defaultFormState);
  const [formError, setFormError] = useState('');
  const session = useSessionStore.use.value();
  const users = useUsersStore.use.value();
  const isLoadingUsers = useUsersStore.use.isLoading();

  const handleFieldChange = useCallback((name: string, value: string[] | string | boolean) => {
    setFormError('');
    setFromValues((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      handleFieldChange(e.target.name, e.target.value);
    },
    [handleFieldChange]
  );

  const handleCheckboxChange = useCallback(
    (e: CheckboxChangeEvent) => {
      handleFieldChange(e.target.name || '', e.target.checked);
    },
    [handleFieldChange]
  );

  const handleCloseModal = useCallback(() => {
    if (!checkIfCreatingTask()) {
      setFromValues(defaultFormState);
      setFormError('');
      closeModal();
    }
  }, [checkIfCreatingTask, closeModal]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      setFormError('');

      void createTask(formValues).then((result) => {
        if (result?.ok === false) {
          setFormError(result.error.message);
        } else {
          handleCloseModal();
        }
      });
    },
    [createTask, formValues, handleCloseModal]
  );

  const handleCreateBtnClick = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const otherUsers = useMemo(() => {
    return users.filter((user) => user.id !== session?.userId);
  }, [session, users]);

  if (!session) return null;

  const body = (
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

      <div>
        <label className="font-bold mb-2 block" htmlFor="editorsIds">
          Editors
        </label>

        <UserSelect
          id="editorsIds"
          name="editorsIds"
          onChange={handleFieldChange}
          users={otherUsers}
          isLoading={isLoadingUsers}
        />
      </div>

      <Checkbox onChange={handleCheckboxChange} name="completed" checked={formValues.completed}>
        Completed
      </Checkbox>
    </form>
  );

  const buttons = (
    <>
      <Button type="primary" loading={isLoading} onClick={handleCreateBtnClick}>
        Create task
      </Button>
      <Button type="primary" onClick={handleCloseModal}>
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
