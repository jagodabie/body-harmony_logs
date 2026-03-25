import './index.css';

type AddLogCardProps = {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  variant: 'weight' | 'temp' | 'mood' | 'activity';
  onClick: () => void;
  className?: string;
};

export const AddLogCard = ({
  icon,
  label,
  subtitle,
  variant,
  onClick,
  className = '',
}: AddLogCardProps) => (
  <button
    className={`add-log-card add-log-card--${variant} ${className}`}
    onClick={onClick}
  >
    {icon}
    <span className="add-log-card__label">{label}</span>
    <span className="add-log-card__sub">{subtitle}</span>
  </button>
);
