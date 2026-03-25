import AddIcon from '@mui/icons-material/Add';

import './index.css';

type AddLogFabProps = {
  onClick: () => void;
  className?: string;
};

export const AddLogFab = ({ onClick, className = '' }: AddLogFabProps) => (
  <div className={`add-log-fab__slot ${className}`}>
    <button className="add-log-fab" onClick={onClick}>
      <AddIcon />
    </button>
  </div>
);
