import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

import Button from '../../Button/Button';
import DeviceSelector from './DeviceSelector';
import TorchButton from './TorchButton';

type ScannerControlsProps = {
  showSelectDevice?: boolean;
  devices: MediaDeviceInfo[];
  deviceId: string | undefined;
  onDeviceChange: (deviceId: string) => void;
  active: boolean;
  torchAvailable: boolean;
  torchOn: boolean;
  onStart: () => void;
  onToggleTorch: () => void;
};

const ScannerControls = ({
  showSelectDevice,
  devices,
  deviceId,
  onDeviceChange,
  active,
  torchAvailable,
  torchOn,
  onStart,
  onToggleTorch,
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
          Icon={DocumentScannerIcon}
        />
      )}

      {active && torchAvailable && (
        <TorchButton
          className="scanner__button"
          torchOn={torchOn}
          onToggle={onToggleTorch}
        />
      )}
    </div>
  );
};

export default ScannerControls;
