import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

import './index.css';

type FormHeaderProps = {
  title?: string;
  onClose: () => void;
  onConfirm?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const FormHeader = ({ title, onClose }: FormHeaderProps) => {
  return (
    <div className="form-base__header form-base__header-layout">
      <button className="header-button header-button--left" onClick={onClose}>
        <ArrowBackIcon />
      </button>
      <h3>{title}</h3>
      <button type="submit" className="header-button header-button--right">
        <CheckIcon />
      </button>
    </div>
  );
};

