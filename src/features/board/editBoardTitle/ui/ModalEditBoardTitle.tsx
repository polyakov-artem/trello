import { type FC } from 'react';
import Modal from '@/shared/ui/Modal/Modal';
import Input from 'antd/es/input/Input';
import { Button } from 'antd';
import { Spinner } from '@/shared/ui/Spinner/Spinner';
import { useModalEditBoard } from '../model/useModalEditBoardTItle';
import { ErrorBanner } from '@/shared/ui/ErrorBanner/ErrorBanner';

export const TITLE = 'Change title';

export const ModalEditBoardTitle: FC = () => {
  const {
    isProcessing,
    isLoading,
    error,
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
  } = useModalEditBoard();

  const body = isLoading ? (
    <Spinner />
  ) : error ? (
    <ErrorBanner title={error.message} withIcon />
  ) : (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
      {formError && <p className="text-red-500">{formError}</p>}
      <div>
        <label className="font-bold mb-2 block" htmlFor="title">
          Title
        </label>

        <Input id="title" name="title" onChange={handleInputChange} value={values.title} />
        {titleError && <p className="text-red-500">{titleError}</p>}
      </div>
    </form>
  );

  const buttons = !isLoading && !error && (
    <>
      <Button
        type="primary"
        loading={isProcessing}
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
