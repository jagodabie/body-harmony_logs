import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

import './index.css';

type FormHeaderProps = {
  title?: string;
  onClose: () => void;
  onConfirm?: () => void;
};

export const FormHeader = ({ title, onClose, onConfirm }: FormHeaderProps) => {
  return (
    <div className="form-base__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button className="header-button" onClick={onClose} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}>
        <ArrowBackIcon />
      </button>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <button className="header-button" onClick={onConfirm} style={{ background: 'none', border: 'none', padding: 0 }}>
        <CheckIcon  />
      </button>
    </div>
  );
};