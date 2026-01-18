import { useEffect, useState } from 'react';
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
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <>
      {open && (
        <div
          className={`snackbar ${type}`}
          onClick={() => setOpen(false)}
          onMouseEnter={() => setOpen(false)}
          onMouseLeave={() => setOpen(true)}
        >
          <span>{message}</span>
          <button className="snackbar-close" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </button>
        </div>
      )}
    </>
  );
};
