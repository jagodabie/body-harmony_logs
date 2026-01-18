import { create } from 'zustand';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

type Snackbar = {
  message: string;
  type: SnackbarType;
};

type UIState = {
  snackbar: Snackbar | null;
  showSnackbar: (message: string, type?: SnackbarType) => void;
  hideSnackbar: () => void;
};

export const useUIStore = create<UIState>(set => ({
  snackbar: null,

  showSnackbar: (message: string, type?: SnackbarType) => {
    set({ snackbar: { message, type: type || 'info' } });
  },

  hideSnackbar: () => {
    set({ snackbar: null });
  },
}));

