import './index.css';

type BottomNavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  className?: string;
};

export const BottomNavItem = ({
  icon,
  label,
  active = false,
  onClick,
  className = '',
}: BottomNavItemProps) => (
  <button
    className={`bottom-nav-item ${active ? 'bottom-nav-item--active' : ''} ${className}`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);
