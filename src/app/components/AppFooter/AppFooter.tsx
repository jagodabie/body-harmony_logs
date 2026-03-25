import BarChartIcon from '@mui/icons-material/BarChart';
import GridViewIcon from '@mui/icons-material/GridView';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import { AddLogDrawer } from './components/AddLogDrawer/AddLogDrawer';
import { AddLogFab } from './components/AddLogFab/AddLogFab';
import { BottomNav } from './components/BottomNav/BottomNav';
import { BottomNavItem } from './components/BottomNavItem/BottomNavItem';
import { useAppFooter } from './hooks/useAppFooter';

import './index.css';

export const AppFooter = () => {
  const { isActive, handleNavigate, drawerOpen, openDrawer, closeDrawer } =
    useAppFooter();

  return (
    <>
      <footer className="app-footer">
        <BottomNav>
          <BottomNavItem
            icon={<GridViewIcon fontSize="small" />}
            label="Dashboard"
            active={isActive('/')}
            onClick={() => handleNavigate('/')}
          />
          <BottomNavItem
            icon={<RestaurantIcon fontSize="small" />}
            label="Meals"
            active={isActive('/meal-logs')}
            onClick={() => handleNavigate('/meal-logs')}
          />
          <AddLogFab onClick={openDrawer} />
          <BottomNavItem
            icon={<BarChartIcon fontSize="small" />}
            label="Logs"
            active={isActive('/logs')}
            onClick={() => handleNavigate('/logs')}
          />
          <BottomNavItem
            icon={<MoreVertIcon fontSize="small" />}
            label="More"
            onClick={() => {}}
          />
        </BottomNav>
      </footer>

      <AddLogDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onNavigate={handleNavigate}
      />
    </>
  );
};
