import type { FC } from 'react';
import { AppRouter } from './AppRouter';
import { ToastContainer, Slide } from 'react-toastify';
import { AppLoader } from './appLoader';
import { AppProviders } from './AppProviders';

const App: FC = () => {
  return (
    <AppProviders>
      <AppLoader>
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
      </AppLoader>
    </AppProviders>
  );
};

export default App;
