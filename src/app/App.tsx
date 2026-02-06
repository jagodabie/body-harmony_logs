import { Snackbar } from '../components/Snackbar/Snackbar';
import { useUIStore } from '../stores/useUIStore';
import { AppRouter } from './router';

import './index.css';

export const App = () => {
  const snackbar = useUIStore(state => state.snackbar);
  const hideSnackbar = useUIStore(state => state.hideSnackbar);

  return (
    <>
      <AppRouter />
      {snackbar && <Snackbar snackbar={{ message: snackbar.message, type: snackbar?.type }} onClose={hideSnackbar} />}
    </>
  );
};
