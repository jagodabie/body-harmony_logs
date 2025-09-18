type DeviceSelectorProps = {
  devices: MediaDeviceInfo[];
  deviceId: string | undefined;
  onDeviceChange: (deviceId: string) => void;
  disabled: boolean;
  className?: string;
};

const DeviceSelector = ({ 
  devices, 
  deviceId, 
  onDeviceChange, 
  disabled,
  className 
}: DeviceSelectorProps) => {
  if (!devices.length) return null;

  return (
    <select
      className={className}
      value={deviceId}
      onChange={(e) => onDeviceChange(e.target.value)}
      disabled={disabled || devices.length <= 1}
      aria-label="Select camera"
    >
      {devices.map((device) => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label || 'Camera'}
        </option>
      ))}
    </select>
  );
};

export default DeviceSelector;
