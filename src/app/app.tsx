import type { FC } from 'react';
import { AppRouter } from './AppRouter';
import { ToastContainer, Slide } from 'react-toastify';

const App: FC = () => {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
};

export default App;
