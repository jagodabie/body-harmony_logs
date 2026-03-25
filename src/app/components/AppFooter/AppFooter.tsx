import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GridViewIcon from '@mui/icons-material/GridView';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Drawer } from '@mui/material';

import './index.css';

export const AppFooter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <footer className="app-footer">
        <nav className="bottom-nav">
          <button
            className={`bottom-nav__item ${isActive('/') ? 'bottom-nav__item--active' : ''}`}
            onClick={() => navigate('/')}
          >
            <GridViewIcon fontSize="small" />
            <span>Dashboard</span>
          </button>

          <button
            className={`bottom-nav__item ${isActive('/meal-logs') ? 'bottom-nav__item--active' : ''}`}
            onClick={() => navigate('/meal-logs')}
          >
            <RestaurantIcon fontSize="small" />
            <span>Meals</span>
          </button>

          <div className="bottom-nav__fab-slot">
            <button className="bottom-nav__fab" onClick={() => setDrawerOpen(true)}>
              <AddIcon />
            </button>
          </div>

          <button
            className={`bottom-nav__item ${isActive('/weight-logs') ? 'bottom-nav__item--active' : ''}`}
            onClick={() => navigate('/weight-logs')}
          >
            <BarChartIcon fontSize="small" />
            <span>Logs</span>
          </button>

          <button className="bottom-nav__item" onClick={() => {}}>
            <MoreVertIcon fontSize="small" />
            <span>More</span>
          </button>
        </nav>
      </footer>
    // TODO: Add actions drawer with more options and styles
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { className: 'bottom-nav__drawer' } }}
      >
        <div className="bottom-nav__drawer-handle" />
        <p className="bottom-nav__drawer-placeholder">Actions - soon</p>
      </Drawer>
    </>
  );
};
