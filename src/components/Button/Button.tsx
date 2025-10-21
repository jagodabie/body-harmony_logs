import CircularProgress from '@mui/material/CircularProgress';

import './index.css';

type ButtonProps = {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  Icon?: React.ElementType;
};

export const Button = ({
  label,
  onClick,
  disabled,
  loading = false,
  Icon,
  size = 'small',
  className = '',
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const buttonClass = `button ${className} ${loading ? 'button--loading' : ''}`;

  return (
    <button onClick={onClick} className={buttonClass} disabled={isDisabled}>
      {loading ? (
        <CircularProgress
          className="button-icon button-loading-icon"
          size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
        />
      ) : (
        Icon && <Icon className="button-icon" fontSize={size} />
      )}
      {label && <span className="button-label">{label}</span>}
    </button>
  );
};
