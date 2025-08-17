import './index.css';

type ButtonProps = {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  Icon?: React.ElementType;
};

const Button = ({ label, onClick, disabled, Icon, size = 'small', className = 'button' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {Icon && <Icon className="button-icon" fontSize={size}/>}
      {label && <span className="button-label">{label}</span>}
    </button>
  );
};

export default Button;
