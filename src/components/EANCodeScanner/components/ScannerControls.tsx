import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

import { Button } from '../../Button/Button';
import { DeviceSelector } from './DeviceSelector';

type ScannerControlsProps = {
  showSelectDevice?: boolean;
  devices: MediaDeviceInfo[];
  deviceId: string | undefined;
  onDeviceChange: (deviceId: string) => void;
  active: boolean;
  initializing: boolean;
  onStart: () => void;
  onClose?: () => void;
};

export const ScannerControls = ({
  showSelectDevice,
  devices,
  deviceId,
  onDeviceChange,
  active,
  initializing,
  onStart,
  onClose,
}: ScannerControlsProps) => {
  return (
    <div className="scanner__controls">
      {showSelectDevice && (
        <DeviceSelector
          className="scanner__select"
          devices={devices}
          deviceId={deviceId}
          onDeviceChange={onDeviceChange}
          disabled={active}
        />
      )}

      {!active && (
        <Button
          className="scanner__button"
          onClick={onStart}
          loading={initializing}
          Icon={DocumentScannerIcon}
          size="small"
        />
      )}
      {active && onClose && (
        <div className="scanner__button-cancel" onClick={onClose}>
          <div className="scanner__button-cancel-text">Cancel</div>
        </div>
      )}
    </div>
  );
};
