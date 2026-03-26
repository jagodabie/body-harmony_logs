import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { Drawer } from '@mui/material';

import { useLogsStore } from '../../../../../stores/useLogsStore';
import type { LogType } from '../../../../../types/BodyLog';
import { AddLogCard } from './components/AddLogCard/AddLogCard';

import './index.css';

type AddLogDrawerProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  className?: string;
};

export const AddLogDrawer = ({
  open,
  onClose,
  onNavigate,
  className = '',
}: AddLogDrawerProps) => {
  const setActiveType = useLogsStore(s => s.setActiveType);

  const navigateToLogs = (type: LogType) => {
    setActiveType(type);
    onNavigate('/logs');
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { className: `add-log-drawer ${className}` } }}
    >
      <div className="add-log-drawer__handle" />
      <h2 className="add-log-drawer__title">Add new log</h2>

      <div className="add-log-drawer__grid">
        <AddLogCard
          variant="weight"
          icon={<MonitorWeightIcon />}
          label="Weight"
          subtitle="kg / BMI"
          onClick={() => navigateToLogs('weight')}
        />
        <AddLogCard
          variant="temp"
          icon={<ThermostatIcon />}
          label="Temperature"
          subtitle="°C"
          onClick={() => navigateToLogs('temperature')}
        />
        <AddLogCard
          variant="mood"
          icon={<SentimentSatisfiedAltIcon />}
          label="Mood"
          subtitle="scale 1–10"
          onClick={() => navigateToLogs('mood')}
        />
        <AddLogCard
          variant="activity"
          icon={<DirectionsRunIcon />}
          label="Activity"
          subtitle="minutes"
          onClick={() => navigateToLogs('activity')}
        />
      </div>

      <button
        className="add-log-drawer__meals"
        onClick={() => onNavigate('/meal-logs')}
      >
        <RestaurantIcon fontSize="small" />
        Meals
      </button>
    </Drawer>
  );
};
