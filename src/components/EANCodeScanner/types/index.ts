export type BarcodeType = 'EAN-13' | 'EAN-8' | 'UPC-A' | 'UPC-E' | 'UNKNOWN';

export type ScanResult = {
  code: string;
  type: BarcodeType;
  isValid: boolean;
  timestamp: number;
};

export type ScannerState = 'idle' | 'initializing' | 'active' | 'error';

export type ScannerConfig = {
  autoStart?: boolean;
  debounceMs?: number;
  validateChecksum?: boolean;
  supportedFormats?: BarcodeType[];
  onInvalidScan?: (code: string) => void;
};

export type ScannerError = {
  type: 'CAMERA_ACCESS' | 'DEVICE_NOT_FOUND' | 'SCANNER_INIT' | 'UNKNOWN';
  message: string;
  originalError?: Error;
};
