import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import clsx from 'clsx';

import { ScannerControls } from './components/ScannerControls';
import { ScannerVideo } from './components/ScannerVideo';
import { useHandleScanner } from './hooks/useHandleScanner';
import type { ScannerConfig, ScanResult } from './types';

import './index.css';

type EANCodeScannerProps = {
  onScanSuccess: (result: ScanResult) => void;
  showSelectDevice?: boolean;
  config?: ScannerConfig;
  className?: string;
};

export const EANCodeScanner = ({
  onScanSuccess,
  showSelectDevice = false,
  config,
  className,
}: EANCodeScannerProps) => {
  const {
    videoRef,
    devices,
    deviceId,
    setDeviceId,
    error,
    start,
    stop,
    closeVideoArea,
    isActive,
    isInitializing,
  } = useHandleScanner(onScanSuccess, config);

  return (
    <div
      className={clsx('scanner', className, {
        'scanner--active': isActive,
        'scanner--initializing': isInitializing,
      })}
    >
      <ScannerControls
        showSelectDevice={showSelectDevice}
        devices={devices}
        deviceId={deviceId}
        onDeviceChange={setDeviceId}
        active={isActive}
        initializing={isInitializing}
        onStart={start}
        onClose={closeVideoArea}
      />
      {error && !isActive && (
        <div className="scanner__inline-error" role="alert">
          <ErrorOutlineIcon className="scanner__inline-error-icon" />
          <span>{error.message}</span>
        </div>
      )}
      <ScannerVideo videoRef={videoRef} active={isActive} onStop={stop} />
    </div>
  );
};
