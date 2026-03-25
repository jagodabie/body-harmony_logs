import './index.css';

type BottomNavProps = {
  children: React.ReactNode;
  className?: string;
};

export const BottomNav = ({ children, className = '' }: BottomNavProps) => (
  <nav className={`bottom-nav ${className}`}>{children}</nav>
);
