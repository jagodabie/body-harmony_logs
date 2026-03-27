import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ThermostatIcon from '@mui/icons-material/Thermostat';

import type { LogType } from '../../../../types/BodyLog';

import './index.css';

type TabItem = {
  type: LogType;
  label: string;
  icon: React.ReactNode;
};

const TABS: TabItem[] = [
  { type: 'weight', label: 'Weight', icon: <MonitorWeightIcon fontSize="small" /> },
  { type: 'temperature', label: 'Temp', icon: <ThermostatIcon fontSize="small" /> },
  { type: 'mood', label: 'Mood', icon: <SentimentSatisfiedAltIcon fontSize="small" /> },
  { type: 'activity', label: 'Activity', icon: <DirectionsRunIcon fontSize="small" /> },
];

type LogTabsProps = {
  activeType: LogType;
  onChangeType: (type: LogType) => void;
  className?: string;
};

export const LogTabs = ({
  activeType,
  onChangeType,
  className = '',
}: LogTabsProps) => (
  <div className={`log-tabs ${className}`}>
    <div className="log-tabs__scroll">
      {TABS.map(tab => (
        <button
          key={tab.type}
          type="button"
          className={`log-tabs__pill log-tabs__pill--${tab.type} ${
            activeType === tab.type ? 'log-tabs__pill--active' : ''
          }`}
          onClick={() => onChangeType(tab.type)}
          aria-pressed={activeType === tab.type}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  </div>
);
