import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import './index.css';

const AppFooter = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('weight-logs');

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    navigate(`/${path}`);
  };

  return (
    <footer className="app-footer">
      <div className="nav-buttons">
        <div
          className={`nav-item ${activeItem === 'weight-logs' ? 'active' : ''}`}
          onClick={() => handleNavigation('weight-logs')}
        >
          <MonitorWeightIcon fontSize="small" />
          <span>Weight Log</span>
        </div>
        <div
          className={`nav-item ${activeItem === 'yours-meal' ? 'active' : ''}`}
          onClick={() => handleNavigation('yours-meal')}
        >
          <RestaurantIcon fontSize="small" />
          <span>Your Meal</span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;