import './ActionButton.css';

interface ActionButtonProps {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  variant?: 'edit' | 'delete';
}

export const ActionButton = ({ 
  onClick, 
  ariaLabel, 
  children, 
  variant = 'edit' 
}: ActionButtonProps) => {
  return (
    <button 
      className={`action-button action-button--${variant}`}
      onClick={onClick} 
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
};

