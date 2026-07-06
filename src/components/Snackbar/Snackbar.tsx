import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import type { SnackbarType } from '../../stores/useUIStore';

import './index.css';

type SnackbarProps = {
  snackbar: { message: string; type: SnackbarType };
  onClose: () => void;
  duration?: number;
};

export const Snackbar = ({
  snackbar,
  onClose,
  duration = 4000,
}: SnackbarProps) => {
  const { message, type } = snackbar;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`snackbar ${type}`}>
      <span>{message}</span>
      <button className="snackbar-close" onClick={onClose}>
        <CloseIcon fontSize="small" />
      </button>
    </div>
  );
};
