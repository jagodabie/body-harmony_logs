import clsx from 'clsx';

import ScannerControls from './components/ScannerControls';
import ScannerVideo from './components/ScannerVideo';
import { useHandleScanner } from './hooks/useHandleScanner';

import './index.css';

type EANCodeScannerProps = {
  showSelectDevice?: boolean;
};

export const EANCodeScanner = ({ showSelectDevice }: EANCodeScannerProps) => {
  const {
    videoRef,
    devices,
    deviceId,
    setDeviceId,
    active,
    error,
    torchAvailable,
    torchOn,
    start,
    toggleTorch,
    stop,
  } = useHandleScanner();

  return (
    <div className={clsx('scanner', { 'scanner--active': active })}>
      <ScannerControls
        showSelectDevice={showSelectDevice}
        devices={devices}
        deviceId={deviceId}
        onDeviceChange={setDeviceId}
        active={active}
        torchAvailable={torchAvailable}
        torchOn={torchOn}
        onStart={start}
        onToggleTorch={toggleTorch}
      />

      {error && (
        <div className="scanner__error" role="alert">
          {error}
        </div>
      )}

      <ScannerVideo videoRef={videoRef} active={active} onStop={stop} />
    </div>
  );
};
