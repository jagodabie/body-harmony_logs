import { useNavigate } from 'react-router-dom';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import './index.css';

const AppFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <div className="nav-buttons">
        <button className="nav-item" onClick={() => navigate('/weight-logs')}>
          <MonitorWeightIcon fontSize="small" />
          <span>Weight Log</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/yours-meal')}>
          <RestaurantIcon fontSize="small" />
          <span>Your Meal</span>
        </button>
      </div>
    </footer>
  );
};

export default AppFooter;